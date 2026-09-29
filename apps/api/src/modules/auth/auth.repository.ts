import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { Prisma, type User } from "../../generated/prisma/client.js";
import { AuthError, unauthenticated } from "./auth.errors.js";
import { hasDatabaseErrorCode, isRetryableTransactionError } from "../content-common/transaction-errors.js";

export interface SessionValues { accessTokenHash: string; refreshTokenHash: string; accessExpiresAt: Date; expiresAt: Date }
export interface RegistrationInput {
  name: string;
  email: string;
  phone: string;
  province: string | null;
  ward: string | null;
}
class RotationConflict extends Error {}
const userSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  province: true,
  ward: true,
  role: true,
  createdAt: true,
} as const;
export type RefreshResult =
  | { kind: "rotated"; user: Pick<User, keyof typeof userSelect>; expiresAt: Date }
  | { kind: "invalid" };

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  findUser(email: string) { return this.prisma.user.findUnique({ where: { email } }); }
  findUserByIdentifier(identifier: { kind: "email" | "phone"; value: string }) {
    return identifier.kind === "email"
      ? this.prisma.user.findUnique({ where: { email: identifier.value } })
      : this.prisma.user.findUnique({ where: { phone: identifier.value } });
  }
  async register(input: RegistrationInput, passwordHash: string, session: SessionValues) {
    try {
      return await this.serializable(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            province: input.province,
            ward: input.ward,
            passwordHash,
            role: "USER",
          },
          select: userSelect,
        });
        await this.addSession(tx, user.id, session);
        return user;
      });
    } catch (error) {
      if (hasDatabaseErrorCode(error, ["P2002", "23505"])) throw new AuthError(409, "EMAIL_UNAVAILABLE", "Unable to register with this email or phone.");
      throw error;
    }
  }
  async login(userId: string, verifiedPasswordHash: string, session: SessionValues) {
    return this.serializable(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.status !== "ACTIVE" || user.passwordHash !== verifiedPasswordHash) {
        throw new AuthError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
      }
      await this.addSession(tx, userId, session);
      return user;
    });
  }
  async openSession(userId: string, session: SessionValues) {
    return this.serializable(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId }, select: { ...userSelect, status: true } });
      if (!user || user.status !== "ACTIVE") {
        throw new AuthError(403, "FORBIDDEN", "Account is not active.");
      }
      await this.addSession(tx, userId, session);
      return user;
    });
  }
  async authenticate(hash: string, now: Date) {
    return this.prisma.authSession.findUnique({
      where: { accessTokenHash: hash },
      select: { id: true, revokedAt: true, expiresAt: true, accessExpiresAt: true, user: { select: { ...userSelect, status: true } } },
    }).then((session) => !session || session.revokedAt || session.expiresAt <= now
      || session.accessExpiresAt <= now || session.user.status !== "ACTIVE" ? null : session);
  }
  async refresh(hash: string, next: SessionValues, now: Date): Promise<RefreshResult> {
    return this.serializable(async (tx) => {
      const token = await tx.authRefreshToken.findUnique({ where: { tokenHash: hash }, select: {
        id: true, usedAt: true, expiresAt: true,
        session: { select: {
          id: true, revokedAt: true, expiresAt: true, accessTokenHash: true,
          user: { select: { ...userSelect, status: true } },
        } },
      } });
      if (!token) return { kind: "invalid" };
      const session = token.session;
      // Return a result, never throw on replay: family revocation must commit.
      if (token.usedAt !== null) {
        await tx.authSession.updateMany({ where: { id: session.id, revokedAt: null }, data: { revokedAt: now } });
        return { kind: "invalid" };
      }
      if (session.revokedAt || session.expiresAt <= now || token.expiresAt <= now || session.user.status !== "ACTIVE") return { kind: "invalid" };
      const used = await tx.authRefreshToken.updateMany({ where: { id: token.id, usedAt: null }, data: { usedAt: now } });
      if (used.count !== 1) throw new RotationConflict();
      const accessExpiresAt = new Date(Math.min(next.accessExpiresAt.getTime(), session.expiresAt.getTime()));
      const rotated = await tx.authSession.updateMany({
        where: { id: session.id, revokedAt: null, accessTokenHash: session.accessTokenHash },
        data: { accessTokenHash: next.accessTokenHash, accessExpiresAt },
      });
      if (rotated.count !== 1) throw new RotationConflict();
      await tx.authRefreshToken.create({ data: { sessionId: session.id, tokenHash: next.refreshTokenHash, expiresAt: session.expiresAt } });
      return { kind: "rotated", user: session.user, expiresAt: session.expiresAt };
    });
  }
  async logout(accessHash: string | null, refreshHash: string | null, now: Date): Promise<void> {
    await this.serializable(async (tx) => {
      const refresh = refreshHash ? await tx.authRefreshToken.findUnique({ where: { tokenHash: refreshHash }, select: { sessionId: true } }) : null;
      if (accessHash || refresh) {
        await tx.authSession.updateMany({ where: { revokedAt: null, OR: [
          ...(accessHash ? [{ accessTokenHash: accessHash }] : []),
          ...(refresh ? [{ id: refresh.sessionId }] : []),
        ] }, data: { revokedAt: now } });
      }
    });
  }
  async revokeAll(userId: string): Promise<void> {
    await this.prisma.authSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }
  async createPasswordReset(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      });
      await tx.passwordResetToken.create({ data: { userId, tokenHash, expiresAt } });
    });
  }
  async consumePasswordReset(tokenHash: string, newPasswordHash: string, now: Date): Promise<boolean> {
    return this.serializable(async (tx) => {
      const token = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
        select: { id: true, userId: true, expiresAt: true, usedAt: true, user: { select: { status: true } } },
      });
      if (!token || token.usedAt !== null || token.expiresAt <= now || token.user.status !== "ACTIVE") return false;
      const used = await tx.passwordResetToken.updateMany({ where: { id: token.id, usedAt: null }, data: { usedAt: now } });
      if (used.count !== 1) throw new RotationConflict();
      await tx.user.update({ where: { id: token.userId }, data: { passwordHash: newPasswordHash } });
      await tx.authSession.updateMany({ where: { userId: token.userId, revokedAt: null }, data: { revokedAt: now } });
      return true;
    });
  }
  async findOAuthAccount(provider: string, providerUserId: string) {
    return this.prisma.oAuthAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } },
      select: { user: { select: { ...userSelect, status: true } } },
    });
  }
  async linkOrCreateOAuthUser(input: {
    provider: string;
    providerUserId: string;
    email: string;
    name: string;
  }) {
    try {
      return await this.serializable(async (tx) => {
        const existing = await tx.user.findUnique({
          where: { email: input.email },
          select: { ...userSelect, status: true },
        });

        if (existing) {
          await tx.oAuthAccount.create({
            data: { userId: existing.id, provider: input.provider, providerUserId: input.providerUserId },
          });
          return existing;
        }

        return await tx.user.create({
          data: {
            email: input.email,
            name: input.name,
            // OAuth-only account: không có mật khẩu dùng được (KHÔNG phải hash Argon2).
            passwordHash: `oauth!${crypto.randomUUID()}`,
            role: "USER",
            oauthAccounts: {
              create: { provider: input.provider, providerUserId: input.providerUserId },
            },
          },
          select: { ...userSelect, status: true },
        });
      });
    } catch (error) {
      if (hasDatabaseErrorCode(error, ["P2002", "23505"])) {
        const linked = await this.findOAuthAccount(input.provider, input.providerUserId);
        if (linked) return linked.user;
      }
      throw error;
    }
  }
  private async addSession(tx: Prisma.TransactionClient, userId: string, session: SessionValues) {
    return tx.authSession.create({ data: {
      userId, accessTokenHash: session.accessTokenHash, accessExpiresAt: session.accessExpiresAt, expiresAt: session.expiresAt,
      refreshTokens: { create: { tokenHash: session.refreshTokenHash, expiresAt: session.expiresAt } },
    } });
  }
  private async serializable<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try { return await this.prisma.$transaction(operation, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); }
      catch (error) {
        if (!(error instanceof RotationConflict) && !isRetryableTransactionError(error, false)) throw error;
        if (attempt === 2) throw new AuthError(409, "AUTH_CONFLICT", "Authentication conflicted. Try again.");
      }
    }
    throw unauthenticated();
  }
}

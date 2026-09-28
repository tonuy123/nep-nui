import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { Prisma, type User } from "../../generated/prisma/client.js";
import { AuthError, unauthenticated } from "./auth.errors.js";
import { hasDatabaseErrorCode, isRetryableTransactionError } from "../content-common/transaction-errors.js";

export interface SessionValues { accessTokenHash: string; refreshTokenHash: string; accessExpiresAt: Date; expiresAt: Date }
class RotationConflict extends Error {}
const userSelect = { id: true, email: true, name: true, role: true, createdAt: true } as const;
export type RefreshResult =
  | { kind: "rotated"; user: Pick<User, keyof typeof userSelect>; expiresAt: Date }
  | { kind: "invalid" };

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  findUser(email: string) { return this.prisma.user.findUnique({ where: { email } }); }
  async register(name: string, email: string, passwordHash: string, session: SessionValues) {
    try {
      return await this.serializable(async (tx) => {
        const user = await tx.user.create({ data: { name, email, passwordHash, role: "USER" }, select: userSelect });
        await this.addSession(tx, user.id, session);
        return user;
      });
    } catch (error) {
      if (hasDatabaseErrorCode(error, ["P2002", "23505"])) throw new AuthError(409, "EMAIL_UNAVAILABLE", "Unable to register with this email.");
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

import { Injectable } from "@nestjs/common";
import type { PublicUser } from "@webdulich/contracts";
import { AuthRepository, type SessionValues } from "./auth.repository.js";
import { PasswordService } from "./password.service.js";
import { ACCESS_TTL_MS, REFRESH_TTL_MS, createToken, isToken, tokenHash } from "./auth.tokens.js";
import { AuthError, unauthenticated } from "./auth.errors.js";
import { mapPublicUser } from "./public-user.js";
import type { AuthPrincipal } from "./auth.types.js";

export interface IssuedSession {
  user: PublicUser; accessToken: string; refreshToken: string; accessExpiresAt: Date; expiresAt: Date;
}
function proposedSession(now: Date) {
  const accessToken = createToken();
  const refreshToken = createToken();
  const accessExpiresAt = new Date(now.getTime() + ACCESS_TTL_MS);
  const expiresAt = new Date(now.getTime() + REFRESH_TTL_MS);
  const values: SessionValues = { accessTokenHash: tokenHash(accessToken), refreshTokenHash: tokenHash(refreshToken), accessExpiresAt, expiresAt };
  return { accessToken, refreshToken, accessExpiresAt, expiresAt, values };
}
function issuedSession(user: PublicUser, tokens: ReturnType<typeof proposedSession>, expiresAt = tokens.expiresAt): IssuedSession {
  return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken,
    accessExpiresAt: new Date(Math.min(tokens.accessExpiresAt.getTime(), expiresAt.getTime())), expiresAt };
}
@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository, private readonly passwords: PasswordService) {}
  async register(name: string, email: string, password: string): Promise<IssuedSession> {
    const passwordHash = await this.passwords.hash(password);
    const session = proposedSession(new Date());
    const user = await this.repository.register(name, email, passwordHash, session.values);
    return issuedSession(mapPublicUser(user), session);
  }
  async login(email: string, password: string): Promise<IssuedSession> {
    const candidate = await this.repository.findUser(email);
    const valid = await this.passwords.verify(candidate?.passwordHash ?? null, password);
    if (!candidate || !valid || candidate.status !== "ACTIVE") throw new AuthError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    const session = proposedSession(new Date());
    const user = await this.repository.login(candidate.id, candidate.passwordHash, session.values);
    return issuedSession(mapPublicUser(user), session);
  }
  async authenticate(token: string | undefined): Promise<AuthPrincipal> {
    if (!isToken(token)) throw unauthenticated();
    const session = await this.repository.authenticate(tokenHash(token), new Date());
    if (!session) throw unauthenticated();
    return { userId: session.user.id, sessionId: session.id, user: mapPublicUser(session.user) };
  }
  async refresh(token: string | undefined): Promise<IssuedSession> {
    if (!isToken(token)) throw unauthenticated();
    const now = new Date();
    const next = proposedSession(now);
    const result = await this.repository.refresh(tokenHash(token), next.values, now);
    if (result.kind === "invalid") throw unauthenticated();
    return issuedSession(mapPublicUser(result.user), next, result.expiresAt);
  }
  async logout(access: string | undefined, refresh: string | undefined): Promise<void> {
    const accessHash = isToken(access) ? tokenHash(access) : null;
    const refreshHash = isToken(refresh) ? tokenHash(refresh) : null;
    if (accessHash || refreshHash) await this.repository.logout(accessHash, refreshHash, new Date());
  }
  revokeAll(userId: string): Promise<void> { return this.repository.revokeAll(userId); }
}

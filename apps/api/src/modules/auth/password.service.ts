import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { AuthError } from "./auth.errors.js";
import { createToken } from "./auth.tokens.js";

export const PASSWORD_HASH_OPTIONS = { type: argon2.argon2id, memoryCost: 65_536, timeCost: 3, parallelism: 1 } as const;
@Injectable()
export class PasswordService {
  private active = 0;
  private dummyHash: Promise<string> | undefined;
  async hash(password: string): Promise<string> {
    return this.run(() => argon2.hash(password, PASSWORD_HASH_OPTIONS));
  }
  async verify(hash: string | null, password: string): Promise<boolean> {
    const candidateHash = hash ?? await (this.dummyHash ??= this.hash(createToken()).catch((error: unknown) => {
      this.dummyHash = undefined;
      throw error;
    }));
    const matches = await this.run(() => argon2.verify(candidateHash, password));
    return hash !== null && matches;
  }
  private async run<T>(operation: () => Promise<T>): Promise<T> {
    if (this.active >= 4) throw new AuthError(429, "RATE_LIMITED", "Too many requests. Try again later.");
    this.active += 1;
    try { return await operation(); } finally { this.active -= 1; }
  }
}

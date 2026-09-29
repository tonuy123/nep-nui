import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG } from "../../config/app-config.module.js";
import type { AppConfig } from "../../config/app-config.js";
import { AuthError } from "./auth.errors.js";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

@Injectable()
export class CaptchaService {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  get required(): boolean {
    return this.config.recaptchaSecretKey !== null;
  }

  async assertValid(token: string | null, remoteIp: string | undefined): Promise<void> {
    if (!this.config.recaptchaSecretKey) return;
    if (!token) throw new AuthError(400, "CAPTCHA_FAILED", "Captcha verification required.");

    const body = new URLSearchParams({
      secret: this.config.recaptchaSecretKey,
      response: token,
    });
    if (remoteIp) body.set("remoteip", remoteIp);

    let success = false;
    try {
      const response = await fetch(VERIFY_URL, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(5000),
      });
      const payload = (await response.json()) as { success?: unknown };
      success = payload.success === true;
    } catch {
      success = false;
    }

    if (!success) throw new AuthError(400, "CAPTCHA_FAILED", "Captcha verification failed.");
  }
}

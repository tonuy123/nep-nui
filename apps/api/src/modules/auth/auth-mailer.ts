import { Inject, Injectable } from "@nestjs/common";
import nodemailer, { type Transporter } from "nodemailer";
import { APP_CONFIG } from "../../config/app-config.module.js";
import type { AppConfig } from "../../config/app-config.js";
import { AuthError } from "./auth.errors.js";

@Injectable()
export class AuthMailer {
  private transporter: Transporter | null = null;

  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  get configured(): boolean {
    return this.config.smtpUrl !== null;
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    if (!this.config.smtpUrl) {
      throw new AuthError(503, "MAIL_NOT_CONFIGURED", "Email delivery is not configured.");
    }

    this.transporter ??= nodemailer.createTransport(this.config.smtpUrl);

    await this.transporter.sendMail({
      from: this.config.mailFrom ?? "no-reply@webdulich.local",
      to,
      subject: "Đặt lại mật khẩu — Vùng sâu vùng xa",
      text: [
        "Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản này.",
        "",
        `Mở liên kết sau để đặt mật khẩu mới (hết hạn sau 30 phút):`,
        resetUrl,
        "",
        "Nếu bạn không yêu cầu, hãy bỏ qua email này. Mật khẩu hiện tại vẫn giữ nguyên.",
      ].join("\n"),
    });
  }
}

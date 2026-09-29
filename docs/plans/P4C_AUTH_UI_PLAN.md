# P4c — Auth UI theo mẫu + mở rộng đăng nhập

Trạng thái: `IMPLEMENTED_UNREVIEWED` — gates/evidence tại Entry 020
(`AI_PROJECT_CONTROL.md`).

## Phạm vi đã giao

| Hạng mục | Cách làm |
|---|---|
| UI đăng nhập | Card giữa màn hình: "Số điện thoại hoặc email", mật khẩu (hiện/ẩn) + link Quên mật khẩu, reCAPTCHA, cặp nút Đăng ký ngay / Đăng nhập, divider "Hoặc", nút Facebook/Google |
| UI đăng ký | 2 cột theo mẫu: Họ tên, SĐT, Email, Tỉnh/Thành (34 đơn vị 2025), Phường/Xã, mật khẩu + nhập lại, reCAPTCHA, checkbox điều khoản, nút Hoàn tất + Quay lại đăng nhập |
| Quên / đặt lại mật khẩu | `/quen-mat-khau`, `/dat-lai-mat-khau?token=` — token một lần, hết hạn 30 phút, thu hồi mọi phiên khi đổi mật khẩu |
| Backend | `users.phone` unique + `province`/`ward`; đăng nhập bằng email **hoặc** SĐT (`identifier`); bảng `password_reset_tokens`; bảng `oauth_accounts` |
| reCAPTCHA | `CaptchaService` verify Google siteverify; bật khi có `RECAPTCHA_SECRET_KEY`; web render widget thật khi `/auth/config` trả `captchaSiteKey`, chưa cấu hình thì hiện hộp disabled ghi rõ |
| OAuth Google/Facebook | `OAuthClient` (authorize/token/profile) + `OAuthService` ký state HMAC, chống CSRF/replay; BFF chuyển tiếp 302 + cookie; chỉ bật khi có client id/secret + `OAUTH_STATE_SECRET` |
| SMTP | `AuthMailer` (nodemailer) gửi link reset; thiếu `SMTP_URL` → API trả 503 `MAIL_NOT_CONFIGURED` (UI nói thật, không giả gửi) |
| Trang chính sách | `/chinh-sach-bao-mat`, `/dieu-khoan` — nội dung ngắn, đúng dữ liệu thực tế hệ thống thu thập |

## Quyết định

- Tỉnh/Thành dùng **34 đơn vị cấp tỉnh sau sắp xếp 2025** (Nghị quyết
  202/2025/QH15); cấp huyện không còn nên trường thứ hai là **Phường/Xã** (text)
  thay cho "Quận/Huyện" trong ảnh mẫu — ghi rõ để Paw chốt.
- SĐT bắt buộc khi đăng ký mới (đúng mẫu); tài khoản OAuth-only không có SĐT và
  không dùng được luồng quên mật khẩu.
- Không cấp credential: OAuth/captcha/SMTP ở trạng thái "chưa cấu hình" được
  hiển thị trung thực (nút mờ/ box ghi chú), không giả lập thành công.

## Bằng chứng

- `npm run lint/typecheck/test` 0: 18 suite/125 unit (gồm state OAuth, chặn
  provider chưa cấu hình, sanitize `next`, yêu cầu email verified).
- `test:auth` 22/22 trên PostgreSQL thật: SĐT bắt buộc + unique + login bằng
  SĐT; tỉnh ngoài danh sách bị từ chối; config endpoint không lộ secret;
  captcha gate; forgot bị chặn khi thiếu mailer; reset một lần + thu hồi phiên
  + không leak identifier lạ. `test:content` 50/50, `test:admin` 7/7.
- `npm run build` 0; browser Chrome production **27/27 check**: layout 2 màn
  theo mẫu, đăng ký → profile hiện SĐT/tỉnh/xã, login bằng SĐT và email, sai
  mật khẩu báo lỗi, trùng SĐT báo lỗi, forgot báo chưa cấu hình, reset thiếu
  token báo lỗi, trang chính sách, 0 overflow 390px, 0 lỗi console ngoài các
  lỗi kiểm thử mong đợi. Ảnh: `D:\codex-task-temp\p4c-verify\`.

## Giới hạn (cần credentials để kiểm chứng thật)

- OAuth chưa chạy với Google/Facebook thật (chưa có client id/secret); logic
  state/link account đã test bằng stub. Cần một lượt browser với credential
  thật trước khi bật.
- reCAPTCHA thật cần site/secret key; SMTP thật cần `SMTP_URL`.
- Chưa có email xác thực tài khoản và chưa có thu hồi/khoá theo OAuth.

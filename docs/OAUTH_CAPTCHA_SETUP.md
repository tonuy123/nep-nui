# Bật Google / Facebook / reCAPTCHA / SMTP cho demo local

Trạng thái code: **đã hoàn tất** (P4c) — OAuth Google/Facebook, reCAPTCHA v2,
SMTP quên mật khẩu đều có sẵn trong API/web. Khi **thiếu credentials**, UI hiển
thị trung thực (nút social disabled, hộp captcha "chưa cấu hình") — không giả lập.
Để bật thật chỉ cần tạo credentials và dán vào `scripts/demo/demo.env`.

## Cách bật (tóm tắt)

1. Copy `scripts/demo/demo.env.example` → `scripts/demo/demo.env` (file này đã được gitignore).
2. Tạo credentials theo hướng dẫn bên dưới, dán vào `demo.env`.
3. Restart demo: `scripts/demo/stop-demo.ps1` rồi `scripts/demo/start-demo.ps1 -SkipBuild -DistDir .next-p7`.

## 1. Google OAuth

1. Vào https://console.cloud.google.com → tạo project (hoặc dùng project có sẵn).
2. **APIs & Services → OAuth consent screen**: chọn External, điền tên app + email.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://127.0.0.1:8080/api/backend/auth/oauth/google/callback`
4. Lấy **Client ID** + **Client Secret** → dán vào `demo.env` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

## 2. Facebook OAuth

1. Vào https://developers.facebook.com → **My Apps → Create App** → loại **Consumer**.
2. Thêm sản phẩm **Facebook Login → Settings**:
   - Valid OAuth Redirect URIs: `http://127.0.0.1:8080/api/backend/auth/oauth/facebook/callback`
3. **App settings → Basic**: lấy **App ID** + **App Secret** → dán vào `demo.env`
   (`FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`).
4. App đang ở Development mode: chỉ tài khoản admin/tester của app đăng nhập được.
   Muốn mở public cần App Review (quyền email) — chỉ cần khi phát hành thật.

## 3. reCAPTCHA v2 (checkbox)

1. Vào https://www.google.com/recaptcha/admin → **Create**.
2. Label tùy ý; type: **reCAPTCHA v2 → "I'm not a robot" Checkbox**.
3. Domains: `127.0.0.1`, `localhost`.
4. Lấy **Site key** + **Secret key** → dán vào `demo.env`
   (`RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`).
5. Lưu ý: khi có secret, API **bắt buộc** verify captcha mọi luồng
   register/login/forgot/reset.

## 4. OAUTH_STATE_SECRET

Chuỗi ngẫu nhiên ≥ 32 ký tự dùng ký state OAuth. Sinh bằng:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Dán kết quả vào `demo.env` (`OAUTH_STATE_SECRET=...`). Thiếu → OAuth coi như chưa cấu hình.

## 5. SMTP (để chạy "Quên mật khẩu")

Ví dụ Gmail (cần App Password, không dùng mật khẩu thường):

```text
SMTP_URL=smtp://ban@gmail.com:app-password@smtp.gmail.com:587
MAIL_FROM=ban@gmail.com
```

Thiếu `SMTP_URL` → API trả `503 MAIL_NOT_CONFIGURED` (UI báo thật, không giả gửi).

## Kiểm tra sau khi bật

| Mục | Cách kiểm |
|---|---|
| Nút Google/Facebook | Vào `/dang-nhap` — nút hết mờ, bấm vào chuyển sang trang provider |
| reCAPTCHA | Hộp captcha hiện widget thật thay vì "chưa cấu hình" |
| Quên mật khẩu | Vào `/quen-mat-khau`, nhập email thật → nhận mail (nếu SMTP đã cấu hình) |

## Bảo mật

- `demo.env` chứa secret — **không commit** (đã gitignore), không gửi qua chat cho ai không cần.
- Đây là credentials local dev; production cần credentials riêng + HTTPS + redirect URI domain thật.

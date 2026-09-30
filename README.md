# Nếp Núi — Website quảng bá du lịch Tây Bắc

Website quảng bá du lịch vùng sâu, vùng xa Tây Bắc Việt Nam:

- **Trang public**: trang chủ, điểm đến, trải nghiệm, hành trình, chuyện bản địa,
  cẩm nang, bản đồ Tây Bắc, nguồn ảnh, giỏ hàng.
- **Dịch vụ**: tour trọn gói, chuyến xe (nhà xe tuyến Hà Nội ↔ Tây Bắc),
  khách sạn, combo du lịch.
- **Tài khoản & CMS**: đăng ký/đăng nhập (email hoặc SĐT; OAuth tùy chọn),
  quên mật khẩu, yêu thích, hành trình đã lưu, yêu cầu tư vấn; admin CMS
  quản lý nội dung, media, người dùng, audit log.

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Web | Next.js 16 (App Router) + React 19 + Tailwind CSS 4 |
| API | NestJS 12 + Prisma 7 + PostgreSQL 17 |
| Khác | TypeScript, npm workspaces (không dùng pnpm) |

## Cấu trúc repo

```text
apps/web            Next.js — giao diện public, auth, tài khoản, admin
apps/api            NestJS REST API — nội dung, auth, CMS (/api/v1)
packages/contracts  Kiểu DTO chia sẻ giữa web và API (build ra dist/)
scripts/demo        Script chạy demo production trên Windows (PowerShell)
docs/api            Contract OpenAPI
compose.yaml        PostgreSQL local cho dev + test
```

## Yêu cầu môi trường

- Node.js 24.x, từ 24.18.0 (`engines.node: ^24.18.0`)
- npm >= 10
- Docker Desktop (cho PostgreSQL local)

## Bắt đầu nhanh (dev)

```powershell
npm install                  # postinstall tự build contracts + generate Prisma client
npm run db:up                # bật PostgreSQL local (Docker)

$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
npm run db:migrate:deploy --workspace @webdulich/api
npm run seed --workspace @webdulich/api
```

Sau đó mở **2 terminal**:

```powershell
# Terminal 1 — API (cổng 3001)
$env:NODE_ENV = 'development'
$env:PORT = '3001'
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
npm run dev:api
```

```powershell
# Terminal 2 — Web (cổng 3000)
npm run dev:web
```

Mở http://localhost:3000

> API/Prisma **không tự nạp file `.env`** — luôn đặt biến môi trường trong
> terminal như trên. `.env.example` ở root là bản mẫu đầy đủ tên biến.
> Web lấy nội dung qua same-origin `/api/backend/*`, chuyển tiếp tới API bằng
> `API_INTERNAL_URL` (mặc định `http://127.0.0.1:3001`) — nên web + API chạy cùng nhau.
> `npm run dev:web` (dev server) luôn phục vụ code hiện tại ngay khi lưu file —
> khác với `next start` ở mục "Chạy production" là phục vụ bản build trong `.next`.

## Database

`compose.yaml` tạo 2 PostgreSQL riêng, chỉ bind loopback:

| Service | Database | Cổng | Dùng cho |
|---|---|---|---|
| `postgres` | `webdulich_dev` | `127.0.0.1:55432` | dev |
| `postgres-test` | `webdulich_test` | `127.0.0.1:55433` | integration tests |

```powershell
npm run db:up      # docker compose up -d
npm run db:down    # docker compose down (giữ nguyên volume dữ liệu)
```

- Seed chạy dạng transaction và idempotent: nạp địa danh mẫu kèm nguồn ảnh;
  chạy lại không tạo bản ghi trùng và không ghi đè nội dung đã biên tập.
- Nếu sửa schema: đổi `apps/api/prisma/schema.prisma` rồi tạo migration mới
  (`npx prisma migrate dev` trong `apps/api`, nhớ set `DATABASE_URL`).

## Chạy production / demo

**Cách nhanh (Windows, 1 lệnh)** — script tự bật DB, migrate, build và start:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/demo/start-demo.ps1
# Web: http://127.0.0.1:8080 — API: http://127.0.0.1:3201
# Dừng: powershell -ExecutionPolicy Bypass -File scripts/demo/stop-demo.ps1
```

Chạy lại không cần build (dùng bản đã build `.next-demo`):
`start-demo.ps1 -SkipBuild -DistDir .next-demo`

**Thủ công**:

> ⚠️ **Quan trọng — bẫy bản build cũ:** `next start` chỉ phục vụ bản build đang
> có trong `.next`. Nếu sửa code mà **không chạy `npm run build`** (hoặc đang
> còn server cũ chạy từ trước), web sẽ hiển thị **bản cũ**. Sau mỗi thay đổi
> code: dừng các server cũ → `npm run build` → start lại. Cách nhanh an toàn
> nhất là dùng `start-demo.ps1` ở trên (script tự build bản mới mỗi lần chạy).

```powershell
npm run build

# Terminal API
$env:PORT = '3001'
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
npm run start:prod --workspace @webdulich/api

# Terminal web
npm run start --workspace @webdulich/web -- --port 3000
```

Production thật cần HTTPS, cookie `Secure` (API chạy `NODE_ENV=production`) và
`CORS_ORIGINS` đúng origin web.

## Tạo tài khoản admin

Tự đăng ký luôn là USER thường. Tạo ADMIN bằng CLI (không in credential ra log):

```powershell
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
$env:ADMIN_EMAIL = 'admin@example.com'
$env:ADMIN_NAME = 'Admin'
$env:ADMIN_PASSWORD = 'mat-khau-manh'
npm run admin:create --workspace @webdulich/api
```

Đăng nhập tại `/dang-nhap` rồi vào `/admin`.

## Cấu hình tùy chọn: OAuth / SMTP / reCAPTCHA

Tất cả đều **optional**: thiếu credential thì tính năng tự ẩn hoặc báo "chưa
cấu hình" — không giả lập. Khi dùng script demo, copy
`scripts/demo/demo.env.example` → `scripts/demo/demo.env` (đã gitignore —
**không commit, không gửi kèm khi bàn giao**) rồi điền:

- **Google OAuth**: tạo OAuth client (Web application) tại
  console.cloud.google.com; Authorized redirect URI phải khớp origin đang chạy,
  ví dụ demo: `http://127.0.0.1:8080/api/backend/auth/oauth/google/callback`
  → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- **Facebook OAuth**: developers.facebook.com → Facebook Login; redirect URI
  ví dụ: `http://127.0.0.1:8080/api/backend/auth/oauth/facebook/callback`
  → `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`. App ở Development mode thì chỉ
  tài khoản tester của app đăng nhập được.
- **reCAPTCHA v2 (checkbox)**: google.com/recaptcha/admin, domain `127.0.0.1`
  và `localhost` → `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`. Khi đã có
  secret, API **bắt buộc** xác minh captcha ở mọi luồng đăng ký/đăng nhập/quên
  mật khẩu.
- **SMTP (quên mật khẩu)** — ví dụ Gmail app password:
  `SMTP_URL=smtp://ban@gmail.com:app-password@smtp.gmail.com:587`,
  `MAIL_FROM=ban@gmail.com`. Thiếu → API trả `503 MAIL_NOT_CONFIGURED`.
- **OAUTH_STATE_SECRET** — chuỗi ngẫu nhiên ≥ 32 ký tự:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

Chạy dev thủ công thì đặt các biến này trong terminal API trước `npm run dev:api`.
Danh sách biến đầy đủ: `.env.example`.

## Kiểm thử & chất lượng

| Lệnh | Nội dung | Cần DB? |
|---|---|---|
| `npm run lint` | ESLint cho web + API | Không |
| `npm run typecheck` | `tsc --noEmit` cho contracts, API, web | Không |
| `npm run test` | Jest unit + health/OpenAPI e2e | Không |
| `npm run test:content` | Integration content API | Có (DB `_test`) |
| `npm run test:auth` | Integration auth/account | Có (DB `_test`) |
| `npm run test:admin` | Integration admin CMS/RBAC | Có (DB `_test`) |

Ví dụ chạy integration test:

```powershell
npm run db:up
$env:TEST_DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?schema=public'
npm run test:content
```

> Test reset dữ liệu database `_test` — tuyệt đối không trỏ vào `webdulich_dev`.

API docs: Swagger UI `http://127.0.0.1:3001/api/v1/docs`, JSON
`http://127.0.0.1:3001/api/v1/openapi.json`. Contract OpenAPI kiểm trong repo:
`docs/api/P3_OPENAPI.yaml`.

## Các trang chính

- **Public**: `/` (trang chủ), `/kham-pha` (khám phá điểm đến),
  `/diem-den/{slug}`, `/trai-nghiem` (+ chi tiết), `/hanh-trinh` (+ chi tiết),
  `/chuyen-ban-dia` (+ chi tiết), `/cam-nang` (+ chi tiết), `/ban-do`,
  `/nguon-anh` (nguồn & giấy phép ảnh), `/gio-hang`,
  `/chinh-sach-bao-mat`, `/dieu-khoan`.
- **Dịch vụ**: `/tour-tron-goi`, `/ve-may-bay` (chuyến xe nhà xe tuyến
  Hà Nội ↔ Tây Bắc), `/khach-san`, `/combo-du-lich`.
- **Tài khoản**: `/dang-nhap`, `/dang-ky`, `/quen-mat-khau`,
  `/dat-lai-mat-khau`, `/tai-khoan` (+ hồ sơ, yêu thích, hành trình đã lưu,
  yêu cầu tư vấn, bảo mật).
- **Admin** (`/admin`, role ADMIN/EDITOR): địa danh, trải nghiệm, hành trình,
  chuyện bản địa, cẩm nang, media, yêu cầu tư vấn, người dùng, audit log.

## Lưu ý nội dung & bản quyền (đọc trước khi công bố)

- Nguồn ảnh + credit tập trung ở trang `/nguon-anh`; phần lớn từ Wikimedia
  Commons (CC BY / CC BY-SA / CC0). Kiểm lại license từng ảnh nếu dùng cho mục
  đích thương mại.
- Ảnh hero trang chủ là bản local preview từ nguồn chưa xác minh bản quyền
  (provenance ở `assets/hero/source/`); bản đồ Tây Bắc đang ghi "nguồn đang
  được xác minh". Cần chốt trước khi nộp/công bố.
- Số liệu marketing ở cuối trang chủ (30+, 10M+, 40+) là **placeholder demo** —
  phải thay bằng số thật hoặc bỏ trước khi phát hành.
- Nội dung trong DB từ `npm run seed` là dữ liệu minh họa.

## Xử lý sự cố nhanh

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| API trả 503, trang tài khoản lỗi | PostgreSQL/Docker chưa chạy | Bật Docker Desktop, `npm run db:up` |
| **Web hiện nội dung cũ hơn code hiện tại** | Đang chạy `next start` với bản build cũ trong `.next`, hoặc mở nhầm một server cũ ở cổng khác | Dừng các server cũ → `npm run build` → start lại (hoặc chạy `scripts/demo/start-demo.ps1` — tự build bản mới); kiểm tra đúng cổng (demo: 8080) và nhấn Ctrl+F5 |
| Lỗi `PrismaClient` not found | Chưa generate client | `npm install` hoặc `npm run prisma:generate --workspace @webdulich/api` |
| Đăng nhập không giữ cookie khi dev | API chạy thiếu `NODE_ENV=development` | Đặt `$env:NODE_ENV = 'development'` trước khi start API |
| Cổng 3000/3001/8080 đang bận | Process cũ còn chạy | Đổi `PORT`/`--port`; demo thì chạy `stop-demo.ps1` trước |
| `&&` không chạy trong PowerShell 5.1 | Shell cũ | Dùng `;` hoặc `cmd1; if ($?) { cmd2 }` |

---

Monorepo dùng **npm workspaces**. Không dùng pnpm; không thêm task runner
ngoài các script trong `package.json`.

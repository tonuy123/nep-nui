# Hướng dẫn chạy dự án — Nếp Núi (runbook)

File này hướng dẫn **từng bước từ số 0 đến lúc đăng nhập được tài khoản admin**,
theo đúng thứ tự. Thông tin chung về dự án xem [README.md](README.md).

- Mọi lệnh chạy trong **PowerShell ở thư mục gốc repo** (ví dụ `D:\webdulich`).
- Các lệnh bên dưới đã được chạy thử lại nguyên văn trước khi bàn giao.
- PowerShell 5.1 **không hỗ trợ `&&`** — gõ từng lệnh, hoặc ngăn cách bằng `;`.
- Trên macOS/Linux: thay `$env:TEN = 'giá trị'` bằng `export TEN='giá trị'`; riêng
  script `scripts/demo/start-demo.ps1` chỉ chạy trên Windows — dùng Cách B hoặc Cách C.

## 0. Chuẩn bị môi trường

| Cần gì | Kiểm tra |
|---|---|
| Node.js 24.x (từ 24.18.0) | `node -v` |
| npm >= 10 | `npm -v` |
| Docker Desktop đang chạy | `docker version` |

## 1. Cài dependencies (chỉ lần đầu)

```powershell
npm install
```

Cuối lệnh, `postinstall` tự build `packages/contracts` và generate Prisma client.
Prisma client nằm ở `apps/api/src/generated/prisma` (không commit — sẽ được tạo lại).

> Nếu npm in cảnh báo dạng `npm warn allow-scripts ... not yet covered ...` —
> **có thể bỏ qua**: các gói cần thiết đều kèm sẵn prebuild hoặc không cần
> script cài đặt (đã kiểm chứng toàn bộ luồng chạy được ngay sau cảnh báo này).

## 2. Bật database local (Docker)

```powershell
npm run db:up
```

Tạo 2 PostgreSQL riêng, chỉ bind loopback:

| Service | Database | Cổng |
|---|---|---|
| `postgres` | `webdulich_dev` | `127.0.0.1:55432` |
| `postgres-test` | `webdulich_test` | `127.0.0.1:55433` |

Kiểm tra: `docker ps` thấy `webdulich-postgres-dev` và `webdulich-postgres-test`.
Tắt khi không dùng: `npm run db:down` (giữ nguyên dữ liệu).

## 3. Migrate database dev

```powershell
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
npm run db:migrate:deploy --workspace @webdulich/api
```

Chờ đến dòng `No pending migrations to apply.` là xong.

> Lưu ý: API/Prisma **không tự nạp file `.env`** — bắt buộc set biến môi trường
> trong terminal như trên. `.env.example` ở root là bản mẫu đủ tên biến.
> Các lệnh sau dùng lại `$env:DATABASE_URL` của terminal này — nếu mở terminal
> mới thì set lại.

## 4. Nạp dữ liệu mẫu (seed)

```powershell
npm run seed --workspace @webdulich/api
```

Seed chạy dạng transaction, **idempotent** — chạy lại bao nhiêu lần cũng được,
không tạo bản ghi trùng, không ghi đè nội dung đã biên tập.

## 5. Chạy web + API — chọn 1 trong 3 cách

### Cách A — Demo bằng 1 lệnh (khuyến nghị, giống lúc nộp bài)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/demo/start-demo.ps1
```

Script tự làm hết: bật DB → migrate → build (contracts + API + web) → start.
Chờ dòng `[demo] READY`:

- Web: **http://127.0.0.1:8080**
- API: http://127.0.0.1:3201/api/v1/health

Dừng: `powershell -ExecutionPolicy Bypass -File scripts/demo/stop-demo.ps1`

Chạy lại nhanh lúc cần demo liên tục (không build lại, dùng bản đã build):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/demo/start-demo.ps1 -SkipBuild -DistDir .next-demo
```

### Cách B — Dev (vừa sửa code vừa xem ngay)

Mở **2 terminal**:

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

Mở http://localhost:3000 — dev server tự cập nhật khi lưu file.

### Cách C — Production thủ công

> ⚠️ **Quan trọng:** `next start` chỉ phục vụ bản build có sẵn trong `.next`.
> Nếu sửa code mà **không chạy `npm run build`**, web sẽ hiển thị **bản cũ**.
> Dừng mọi server cũ trước, rồi build lại — hoặc dùng Cách A cho an toàn.

```powershell
npm run build

# Terminal API
$env:PORT = '3001'
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
npm run start:prod --workspace @webdulich/api

# Terminal web
npm run start --workspace @webdulich/web -- --port 3000
```

## 6. Tạo tài khoản ADMIN

> Người dùng tự đăng ký ở `/dang-ky` chỉ có quyền USER. ADMIN tạo bằng CLI dưới đây.
>
> **Điều kiện bắt buộc:**
> - **Mật khẩu**: ít nhất **16 ký tự**, có đủ **chữ thường + chữ hoa + số + ký tự đặc biệt**.
> - **Email**: đúng định dạng, và **chưa từng được tạo** trong database.

```powershell
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
$env:ADMIN_EMAIL = 'admin@nepnui.vn'
$env:ADMIN_NAME = 'Quản trị Nếp Núi'
$env:ADMIN_PASSWORD = 'NepNui@TayBac2026!'
npm run admin:create --workspace @webdulich/api
```

Kết quả đúng — dòng cuối in ra:

```text
Admin account created.
```

Sau đó:

1. Vào http://127.0.0.1:8080/dang-nhap
2. Đăng nhập bằng `ADMIN_EMAIL` + `ADMIN_PASSWORD` ở trên
3. Menu tài khoản sẽ có mục **Quản trị** → mở http://127.0.0.1:8080/admin

### Lỗi hay gặp ở bước này

| Thông báo | Lý do | Cách xử lý |
|---|---|---|
| `Admin account already exists - skip creation...` | Email đã là ADMIN từ trước | **Không phải lỗi** — lệnh vẫn thành công; chỉ cần đăng nhập bằng mật khẩu đã đặt |
| `... mat khau qua yeu ...` | Mật khẩu < 16 ký tự hoặc thiếu loại ký tự | Dùng đúng ví dụ `NepNui@TayBac2026!` (18 ký tự, đủ 4 loại) |
| `... email nay thuoc mot tai khoan khac (khong phai ADMIN) ...` | Email trùng tài khoản USER thường | Đổi `ADMIN_EMAIL` khác |
| `... thieu DATABASE_URL ...` | Chưa set biến môi trường | Chạy lại đủ 4 dòng `$env:` như trên trong **cùng terminal** |
| `Admin bootstrap failed. Check ...` | Database chưa chạy / chưa migrate | Làm lại bước 2 và bước 3 |

> Chạy lại lệnh tạo admin trên máy đã tạo trước đó là **bình thường**: CLI báo
> `already exists - skip creation` và kết thúc thành công — việc cần làm chỉ là đăng nhập.

## 7. Kiểm tra sau khi chạy (checklist)

- [ ] Trang chủ http://127.0.0.1:8080 mở được, ảnh + bản đồ load đủ
- [ ] `/kham-pha` có danh sách điểm đến (dữ liệu từ seed)
- [ ] Đăng ký tài khoản mới ở `/dang-ky` → vào được `/tai-khoan`
- [ ] Đăng nhập admin → `/admin` thấy dashboard + menu 10 mục
- [ ] Tìm kiếm trên header trả kết quả

## 8. Cấu hình tùy chọn (OAuth / SMTP / reCAPTCHA)

Tất cả đều optional — thiếu thì tính năng tự ẩn hoặc báo "chưa cấu hình",
**không gây lỗi**. Khi dùng script demo, copy file mẫu rồi điền:

```powershell
Copy-Item scripts/demo/demo.env.example scripts/demo/demo.env
```

`demo.env` đã được gitignore — **không commit, không gửi kèm khi bàn giao**.

- **Google OAuth**: console.cloud.google.com → OAuth client (Web application),
  redirect URI phải khớp origin đang chạy, ví dụ demo:
  `http://127.0.0.1:8080/api/backend/auth/oauth/google/callback`
- **Facebook OAuth**: developers.facebook.com → Facebook Login, redirect URI:
  `http://127.0.0.1:8080/api/backend/auth/oauth/facebook/callback`
- **reCAPTCHA v2 (checkbox)**: google.com/recaptcha/admin, domain `127.0.0.1`
  và `localhost`. Khi đã có secret, API bắt buộc xác minh captcha ở các luồng
  đăng ký/đăng nhập/quên mật khẩu.
- **SMTP (quên mật khẩu)** — ví dụ Gmail app password:
  `SMTP_URL=smtp://ban@gmail.com:app-password@smtp.gmail.com:587`
- **OAUTH_STATE_SECRET** — chuỗi ngẫu nhiên ≥ 32 ký tự:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Điền xong: `stop-demo.ps1` rồi `start-demo.ps1 -SkipBuild -DistDir .next-demo`.
Danh sách biến đầy đủ: `.env.example`.

## 9. Kiểm thử (tùy chọn)

| Lệnh | Nội dung | Cần DB? |
|---|---|---|
| `npm run lint` | ESLint web + API | Không |
| `npm run typecheck` | tsc cho contracts, API, web | Không |
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

API docs: Swagger UI `http://127.0.0.1:3001/api/v1/docs` (dev) ·
`http://127.0.0.1:3201/api/v1/docs` (demo). Contract OpenAPI:
`docs/api/P3_OPENAPI.yaml`.

## 10. Xử lý sự cố chung

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Web hiện nội dung cũ hơn code | `next start` với bản build cũ trong `.next`, hoặc mở nhầm server cũ ở cổng khác | Dừng server cũ → `npm run build` → start lại (hoặc dùng Cách A); mở đúng cổng 8080; nhấn Ctrl+F5 |
| API trả 503 / trang tài khoản lỗi | PostgreSQL/Docker chưa chạy | Mở Docker Desktop → `npm run db:up` |
| Lỗi `PrismaClient` not found | Chưa generate client | `npm install` hoặc `npm run prisma:generate --workspace @webdulich/api` |
| Đăng nhập không giữ cookie khi dev | API chạy thiếu `NODE_ENV=development` | Set `$env:NODE_ENV = 'development'` rồi start lại API |
| Cổng 3000/3001/8080 đang bận | Process cũ còn chạy | Demo: chạy `stop-demo.ps1`; dev: đổi `PORT` / `--port` |
| `&&` không chạy | PowerShell 5.1 | Gõ `;` hoặc tách lệnh: `cmd1; if ($?) { cmd2 }` |

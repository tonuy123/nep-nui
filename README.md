# Website quảng bá du lịch vùng sâu, vùng xa

Monorepo cho website quảng bá du lịch vùng sâu, vùng xa. Trạng thái hiện tại:

- **P1 — `VERIFIED`** (Paw chấp thuận 2026-09-27, Entry 003).
- **P2 — `VERIFIED` cho bản local 2.5D** (Paw chấp thuận 2026-09-28, Entry 008).
  Release gates về quyền ảnh/thiết bị thật vẫn mở.
- **P3 — `VERIFIED` local**: PostgreSQL, Prisma và 10 public GET endpoints đã
  qua Codex independent review, final repairs và gates Entry 013: 87 unit,
  3 health/OpenAPI và 50 content tests PostgreSQL thật pass. Frontend public
  chưa bind toàn bộ dữ liệu API (thuộc P6).
- **P4 — `IMPLEMENTED_UNREVIEWED`**: Authentication/RBAC, tài khoản và header
  với sáu chức năng mở route riêng. Local API/web, PostgreSQL integration tests
  và browser preview đã chạy; xem evidence/handoff ở Entry 014 và
  [P4_AUTH_PLAN.md](docs/plans/P4_AUTH_PLAN.md). P5–P7 chưa mở.
- **P4b — `IMPLEMENTED_UNREVIEWED`**: trang chủ editorial Tây Bắc, carousel
  4/2/1, 10 bài địa danh và năm route chức năng; evidence ở Entry 015–017.
- **P5 — `IMPLEMENTED_UNREVIEWED`**: Admin/Editor CMS — CRUD 5 loại nội dung,
  publish/archive/restore, media library + use protection, hộp thư yêu cầu,
  quản lý người dùng (ADMIN), audit log và dashboard. Evidence/gates ở Entry 018
  và [P5_CMS_PLAN.md](docs/plans/P5_CMS_PLAN.md). P6/P7 chưa mở; media upload
  thật chờ quyết định object-storage provider.
- **P6 — `IMPLEMENTED_UNREVIEWED`**: bind toàn bộ trang public vào content API
  (danh sách + chi tiết + search/filter + empty/error thật), lưu yêu thích/lưu
  hành trình/gửi yêu cầu tư vấn end-to-end, SEO metadata + JSON-LD; DB
  destinations mở rộng field biên tập và seed 10 địa danh P4b kèm nguồn. Evidence
  ở Entry 019 và [P6_INTEGRATION_PLAN.md](docs/plans/P6_INTEGRATION_PLAN.md).
  Bản đồ tương tác chờ nhà cung cấp tile; P7 chưa mở.

Đọc `AI_PROJECT_CONTROL.md` trước khi làm bất cứ điều gì — đây là single source
of truth cho scope, architecture, route contract và phase roadmap.

## Cấu trúc workspace

```text
apps/web            Next.js App Router (public, auth, account, admin + P2 visual)
apps/api            NestJS REST API (health, public content, auth, account, RBAC)
packages/contracts  Shared health/content/auth DTO types, build ra dist/
```

Workspace dùng **npm workspaces**. Không dùng pnpm. Không thêm task runner.

## Yêu cầu môi trường

- Node.js 24.x, từ 24.18.0 (`engines.node: ^24.18.0`, đã kiểm tra với v24.18.0).
- npm >= 10 (đã kiểm tra với 11.16.0).
- Docker Desktop (đã kiểm tra với Docker 29.7.2 / engine) cho PostgreSQL local.

## Cài đặt

```powershell
npm install
```

`postinstall` sẽ build `packages/contracts` và chạy `prisma generate` cho API.
Generated Prisma client nằm ở `apps/api/src/generated/prisma` (không commit).

## Database local (Docker Compose)

`compose.yaml` tạo hai PostgreSQL 17.6 riêng biệt, chỉ bind loopback:

| Service | Database | Host port | Volume |
|---|---|---|---|
| `postgres` | `webdulich_dev` | `127.0.0.1:55432` | `webdulich-dev-pgdata` |
| `postgres-test` | `webdulich_test` | `127.0.0.1:55433` | `webdulich-test-pgdata` |

```powershell
npm run db:up      # docker compose up -d
npm run db:down    # docker compose down (không xoá volume)
```

Migration và seed dùng **process env** — API/Prisma CLI không tự nạp file `.env`
(xem mục Biến môi trường):

```powershell
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
npm run db:migrate:deploy --workspace @webdulich/api
npm run seed --workspace @webdulich/api
```

Seed là transaction và idempotent. Từ P6, seed đưa **10 địa danh Tây Bắc P4b**
(đã có nguồn du lịch + ảnh CC0/Unsplash/CC BY-SA kèm attribution) vào CMS làm
nội dung công khai: destination đã tồn tại theo slug thì bỏ qua (không ghi đè
nội dung đang biên tập), media tái dùng theo `publicUrl`. Chạy lại seed không
tạo bản ghi trùng. Quyền ảnh/địa điểm vẫn là gate xác nhận của Paw khi review.

## Command đã được kiểm tra

| Command | Hành vi |
|---|---|
| `npm run dev:web` | Next.js dev server (mặc định http://localhost:3000) |
| `npm run dev:api` | NestJS watch mode (mặc định http://127.0.0.1:3001) |
| `npm run lint` | ESLint cho web, API (gồm prisma/seed/config) |
| `npm run typecheck` | `tsc --noEmit` cho contracts, API, web |
| `npm run test` | Jest unit + health/OpenAPI e2e — **không cần DB** |
| `npm run test:content` | Integration tests content API trên PostgreSQL test (cần DB) |
| `npm run test:auth` | Integration tests auth/account trên PostgreSQL test (cần DB) |
| `npm run test:admin` | Integration tests admin CMS/RBAC/audit trên PostgreSQL test (cần DB) |
| `npm run build` | contracts → API → web (production build) |
| `npm run db:up` / `npm run db:down` | Bật/tắt PostgreSQL local |

Build trước khi chạy production:

```powershell
npm run build
```

Terminal API (đặt cổng riêng, không dùng chung terminal với web):

```powershell
$env:PORT = '3001'
$env:DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public'
npm run start:prod --workspace @webdulich/api
```

Terminal web:

```powershell
npm run start --workspace @webdulich/web -- --port 3000
```

Web chỉ gọi same-origin `/api/backend/*`; BFF gọi API qua `API_INTERNAL_URL`
(mặc định `http://127.0.0.1:3001`). API local phải chạy với
`NODE_ENV=development` để cookie HTTP hoạt động trên loopback. Production cần
HTTPS, cookie `Secure` và `CORS_ORIGINS` đúng origin web; không đưa token vào
`NEXT_PUBLIC_*` hay browser storage.

## API (P3)

Prefix `/api/v1`. 10 public GET endpoints, không yêu cầu đăng nhập:

```text
GET /api/v1/destinations           GET /api/v1/destinations/{slug}
GET /api/v1/experiences            GET /api/v1/experiences/{slug}
GET /api/v1/itineraries            GET /api/v1/itineraries/{slug}
GET /api/v1/stories                GET /api/v1/stories/{slug}
GET /api/v1/guides                 GET /api/v1/guides/{slug}
```

- List: `{ data, pagination: { nextCursor, hasMore } }`, `limit` mặc định 12,
  tối đa 50, cursor `publishedAt DESC, id DESC`. Detail: `{ data }`.
- Error contract: `{ error: { code, message, details? }, requestId }`.
  Query/cursor/slug sai: 400; slug không tồn tại/draft/archived: cùng 404;
  DB không sẵn sàng: 503 sanitized.
- Public response dùng `Cache-Control: no-store`. CORS theo allowlist
  `CORS_ORIGINS` (không wildcard).
- Chỉ nội dung `PUBLISHED` (và destination cha `PUBLISHED`, media `CLEARED`)
  được trả ra public.
- `GET /api/v1/health` giữ nguyên contract cũ; là liveness, không query DB —
  API vẫn serve health khi database down, content endpoint trả 503.
- Publication mutation (nội bộ, chưa có HTTP): transition chạy trong
  SERIALIZABLE transaction với conditional update + bounded retry; conflict
  hết retry trả `PUBLICATION_CONFLICT` (409). Archive không đổi `publishedAt`.

### Giới hạn nội dung (P3 review repair)

- `publishedAt` chỉ trong domain `0001-01-01..9999-12-31` (UTC, milliseconds);
  cursor ngoài domain trả 400 trước khi query DB. Migration repair thêm CHECK
  cho 5 bảng.
- `body` tối đa 20.000 code points (không phải UTF-16 units); mỗi
  `itinerary_days.content` tối đa 5.000 code points; publish yêu cầu nonblank
  và trong bound. Migration repair thêm CHECK tương ứng; preflight fail-closed
  nếu dữ liệu cũ vi phạm.
- Lỗi DB từ Prisma 7 driver adapter được classify qua whitelist code/SQLSTATE
  (kể cả `originalCode` trong wrapper) → 503; logger chỉ ghi fixed event +
  requestId, không ghi raw exception message/stack/SQL/credential.

OpenAPI:

- Contract kiểm vào repo: `docs/api/P3_OPENAPI.yaml` (OpenAPI 3.1); detail
  schemas là closed object đầy đủ và được validate bằng Ajv2020 trên payload
  HTTP thật trong `openapi-schema.e2e-spec.ts`.
- Swagger UI: `http://127.0.0.1:3001/api/v1/docs`;
  JSON: `http://127.0.0.1:3001/api/v1/openapi.json`.

### Integration tests (cần PostgreSQL test)

```powershell
npm run db:up
$env:TEST_DATABASE_URL = 'postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?schema=public'
npm run test:content
```

`test:content` chạy 4 suite: `content` (visibility/pagination/validation/DB
constraints), `test-db-guard` (parser + reset), `publication-concurrency`
(barrier schedule + atomic transitions), `openapi-schema` (static/runtime
contract). Guard là validated binding: chỉ nhận loopback + port explicit +
database kết thúc `_test` + query đúng `schema=public` + `PGOPTIONS` rỗng;
alias `localhost`/`127.0.0.1` được normalize về một identity; reset là TRUNCATE
qualified trong transaction với identity check, không CASCADE và không export
unchecked reset. Thiếu `TEST_DATABASE_URL` thì từ chối chạy; không bao giờ trỏ
vào database dev.

Adapter-injection probes của classifier nằm trong unit suite và tự skip khi
không có `TEST_DATABASE_URL`; chạy đầy đủ bằng cách export biến này trước
`npm run test`.

## API và giao diện P4

Đăng ký/đăng nhập/refresh/logout dùng Argon2id và access/refresh token opaque,
chỉ hash token lưu DB. Access 10 phút, refresh tối đa 7 ngày và rotate khi dùng;
replay thu hồi cả session. Cookie `HttpOnly`, `SameSite=Strict`, `Secure` khi
production; unsafe request cần CSRF header và Origin hợp lệ. API kiểm tra
session/role trên mỗi protected request, không dựa vào menu web để phân quyền.

- `/api/v1/auth/{csrf,register,login,refresh,logout,me}`: auth/session.
- `/api/v1/me/*`: profile, đổi mật khẩu, phiên đăng nhập, điểm đến yêu thích,
  hành trình đã lưu, yêu cầu tư vấn và lịch sử của chính user.
- `/api/v1/admin/access`: EDITOR hoặc ADMIN; `/api/v1/admin/users/access`:
  ADMIN. CMS/user CRUD thuộc P5.
- Account collections có cap 50/user; chỉ hiển thị nội dung còn public. Khi
  thêm mục mới, bookmark đã ẩn của đúng user được dọn trong transaction để
  tránh danh sách kẹt ở cap. Inquiry giới hạn 5/phút/user.

Self-registration luôn là USER; không seed tài khoản ADMIN/mật khẩu mặc định.
Nếu cần tạo ADMIN local, đặt `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD`
trong process environment rồi chạy `npm run admin:create --workspace
@webdulich/api` trên database đã migrate. CLI từ chối trùng email và không in
credential. Không commit `.env` có secret.

Auth/account integration cần một database tên kết thúc `_test` độc lập với dev.
Trong terminal test riêng, migrate bằng `DATABASE_URL` trỏ đúng database test,
sau đó đặt cùng URL vào `TEST_DATABASE_URL` và chạy `npm run test:auth`.
Test reset 14 bảng cố định trong database test đã kiểm danh tính; **xóa dữ
liệu hiện có của database test**, vì vậy hãy dùng DB `_test` riêng cho lượt
kiểm thay vì dữ liệu mẫu cần giữ. Tuyệt đối không trỏ vào `webdulich_dev`.

## Biến môi trường

`.env.example` ở root là template tham khảo, chỉ chứa tên biến và giá trị mẫu
an toàn. API và Prisma CLI **chỉ đọc process env** (không auto-load `.env`);
đặt biến trong terminal như các command ở trên.

- `DATABASE_URL` — PostgreSQL dev (bắt buộc để start API và chạy Prisma migrate/seed).
- `TEST_DATABASE_URL` — PostgreSQL test riêng cho integration; không fallback sang `DATABASE_URL`.
- `CORS_ORIGINS` — allowlist origin, comma-separated (mặc định localhost/127.0.0.1:3000).
- `PORT` — cổng API (mặc định 3001).
- `API_INTERNAL_URL` — upstream BFF chỉ ở server Next; mặc định `http://127.0.0.1:3001`.
- `NODE_ENV` — local HTTP là `development`; production HTTPS là `production`.
- `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` — chỉ cho CLI bootstrap theo chủ đích.
- `NEXT_PUBLIC_API_BASE_URL` — base URL public content cho các client khác (P6).

## Route web hiện có

Public: `/`, `/kham-pha`, `/trai-nghiem`, `/hanh-trinh`, `/ban-do`,
`/chuyen-ban-dia`, `/cam-nang`.

Auth/Account/Admin: `/dang-nhap`, `/dang-ky`, `/tai-khoan` (+ 4 route con),
`/admin` (+ 10 route con).

Header trắng/forest/gold có sáu link tới sáu route public riêng, active state
và menu mobile keyboard/focus. Login/register/account đã nối API qua BFF.

Admin (`/admin`) là CMS thật (P5): `/admin/diem-den`, `/admin/trai-nghiem`,
`/admin/hanh-trinh`, `/admin/chuyen-ban-dia`, `/admin/cam-nang` (CRUD + xuất
bản/lưu trữ/khôi phục), `/admin/media` (thư viện + trạng thái xác minh),
`/admin/yeu-cau` (xử lý yêu cầu), `/admin/nguoi-dung` và `/admin/audit-log`
(chỉ ADMIN). API `/api/v1/admin/*` kiểm tra RBAC ở backend; upload media thật
chưa triển khai (chờ object-storage provider). Public pages vẫn là visual P2/P4b
và **chưa bind toàn bộ dữ liệu content API** (P6); map engine, booking và
payment chưa triển khai.

## P2 cinematic preview

Plan: `docs/plans/P2_VISUAL_PLAN.md`. Hero là 2.5D photo layers với native
CSS/Web Animations API; nội dung/CTA server-rendered. Scene không tự chạy lại
khi quay về home trong cùng tab/session; có Skip/Pause/Replay và reduced-motion.

Nguồn ảnh/provenance: `assets/hero/source/`. Ảnh Pinterest đã chọn hiện chưa
xác minh license/địa điểm; chỉ là local preview. Quyền ảnh là gate trước khi
nộp thi hoặc deploy. Không suy ra địa danh từ title của pin.

Kiểm và cập nhật manifest từ scene config:

```powershell
node scripts/hero/verify-assets.mjs
node scripts/hero/build-manifest.mjs
```

Native WebGL prototype trong `scripts/hero/terrain-spike.mjs` chỉ phục vụ
benchmark, không được import bởi public routes. True 3D production được hoãn;
nếu triển khai cần scope/approval riêng và physical-mobile evidence.

Evidence và giới hạn phép đo nằm trong `docs/plans/P2_VISUAL_PLAN.md` §11;
exact file inventory và handoff ở `AI_PROJECT_CONTROL.md` → Entry 006;
final shared typography repair và regression ở Entry 007. P3 handoff ở Entry 011.

## Ghi chú phase

- Mỗi phiên chỉ triển khai một phase được Paw cho phép; xem mục 9–10 trong
  `AI_PROJECT_CONTROL.md`.
- `packages/ui`, `packages/eslint-config`, `packages/tsconfig` chưa được tạo vì
  chưa có consumer thật — tránh dead scaffold.

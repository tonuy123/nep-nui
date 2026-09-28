# P4 — Authentication, RBAC, user area và header

Ngày: 2026-09-28. Owner: Paw. Architecture/integration: Codex.
Status: IMPLEMENTED_UNREVIEWED. P3 final review/gates pass tại AI_PROJECT_CONTROL Entry013; P4 implementation, repair và evidence ở Entry014. P5 chưa mở.

## Authorization và phạm vi

Paw yêu cầu Codex review P3, sửa lỗi còn lại, note dự án và tự chuyển P4. Paw đồng thời yêu cầu header có từng nhóm chức năng mở trang riêng, tham khảo https://travel.com.vn/ nhưng không sao chép thiết kế/nội dung. Đây là authorization mới nhất, thay checkpoint cũ “chờ Paw mở P4”. Không mở P5/P6/P7, không booking/payment/flights integration và không tự commit/deploy.

## Product và routes

Header trắng/ivory, logo riêng, điều hướng ngang rõ ràng trên desktop, active state và menu responsive trên mobile. Mỗi mục là Next Link tới route riêng, không dùng hash/scroll cho main navigation. Giữ màu forest/gold và bản sắc cảnh quan/cộng đồng, không lấy markup/CSS/logo/ảnh/copy của Vietravel. Giữ hero animation hiện tại.

| Mục | Route | Chức năng |
|---|---|---|
| Khám phá | /kham-pha | Điểm đến |
| Trải nghiệm | /trai-nghiem | Hoạt động bản địa |
| Hành trình | /hanh-trinh | Gợi ý lịch trình/tour khám phá |
| Bản đồ | /ban-do | Vị trí và danh sách điểm đến |
| Chuyện bản địa | /chuyen-ban-dia | Nội dung văn hóa/cộng đồng |
| Cẩm nang | /cam-nang | Chuẩn bị và tư vấn |

Đăng nhập/tài khoản bên phải, CTA Lập chuyến đi tới /hanh-trinh. Admin chỉ xuất hiện cho EDITOR/ADMIN trong khu vực tài khoản; USER không có quyền API quản trị. Header tham khảo nguyên tắc nhóm chức năng từ /tours, /flights, /hotels, /combo, /tin-moi và FAQ của Travel; không mô phỏng sản phẩm thương mại đó. Các public route vẫn giữ trạng thái content P2/P3 cho tới P6; P4 chỉ dùng public API để chọn nội dung thật khi lưu vào tài khoản.

## Architecture và trade-offs

Giữ modular monolith Nest/Prisma/PostgreSQL + Next App Router. Password Argon2id async (64 MiB, 3 iterations, parallelism 1), password 12..128 code points, không trim/password normalization. Email trim/lowercase, tối đa 320; name trim 1..100 code points. Register chỉ nhận name/email/password, role luôn USER; unknown fields bị 400.

Access và refresh là opaque random 32 bytes, canonical base64url 43 chars, chỉ SHA-256 hash lưu DB. Access TTL 10 phút. Refresh family có absolute TTL 7 ngày; mỗi refresh rotate cả access/refresh, lưu hash lịch sử để phát hiện reuse. Used refresh token bị replay: commit revoke toàn family rồi trả 401; không throw trong transaction làm rollback revocation. Transaction SERIALIZABLE/CAS và bounded retry 3 lần. Hai refresh đồng thời: một rotation có thể thành công nhưng replay cạnh tranh revoke family; frontend bắt buộc single-flight refresh. Logout/password change/revoked/disabled user vô hiệu hóa access ngay vì guard đọc DB indexed hash + user role/status mỗi request. Không JWT/custom signing, không token/password trong JSON/localStorage/log.

Đánh đổi: mỗi protected request có một indexed DB lookup; phù hợp single-instance demo/dataset nhỏ và giúp revocation/RBAC tức thời. Rate limit in-memory bounded per instance, không tuyên bố scale multi-instance; Redis/distributed limit là P7 nếu cần. Nhiều browser qua cùng Next BFF có chung API peer IP, vì vậy giới hạn thấp theo IP sẽ khóa chéo người dùng: login/register dùng hash của normalized email, inquiry dùng authenticated user ID; IP chỉ là coarse backstop cao hơn. Refresh-history giữ tối đa absolute 7 ngày/session, cần cleanup định kỳ trước deploy. Không auto tạo tài khoản ADMIN/default password.

## Cookie, CSRF và BFF

Cookie names wd_access, wd_refresh, wd_csrf; HttpOnly, SameSite=Strict, Path=/, Secure trong production HTTPS. Development localhost có Secure=false tường minh; production phải cấu hình cookie secure và web origin hợp lệ. Refresh cookie TTL 7 ngày, access 10 phút, csrf 1 giờ. Clear cookies dùng cùng flags/path.

GET /auth/csrf trả random token và set HttpOnly wd_csrf. Mọi unsafe auth/me request đòi X-CSRF-Token trùng cookie bằng timingSafeEqual và Origin thuộc allowlist exact. Không dùng SameSite/CORS làm kiểm tra CSRF duy nhất. GET không mutate. CORS cho explicit origins, credentials=true, GET/HEAD/OPTIONS/POST/PATCH/PUT/DELETE và headers Content-Type/X-Request-Id/X-CSRF-Token. Login/register/refresh/logout cũng chống login CSRF.

Browser chỉ gọi Next same-origin /api/backend/[...path]. BFF dùng API_INTERNAL_URL server-only (default http://127.0.0.1:3001), cố định upstream /api/v1, allowlist auth/me/admin-access/public-content GET routes; không open proxy, không forward arbitrary Host/X-Forwarded-* hoặc redirect. Forward cookie/content-type/origin/CSRF; không log secrets. Giới hạn body 16 KiB và timeout 10s; sanitized 502/503 upstream failure. Forward Set-Cookie nguyên từng header và Cache-Control:no-store. Không cache response cá nhân. API role guards là trust boundary, web route guards chỉ bổ sung UX.

## Database (additive migration)

6 bảng mới:
- users: UUID, email unique normalized, name, passwordHash, role USER/EDITOR/ADMIN, status ACTIVE/DISABLED, timestamps.
- auth_sessions: UUID, user FK, accessTokenHash unique, accessExpiresAt, expiresAt absolute refresh, revokedAt, timestamps.
- auth_refresh_tokens: UUID, session FK, tokenHash unique, expiresAt, usedAt, createdAt; lịch sử rotate/reuse.
- favorites: UUID, user FK, destination FK, unique(userId,destinationId), createdAt.
- saved_itineraries: UUID, user FK, itinerary FK, unique(userId,itineraryId), createdAt.
- inquiries: UUID, user FK, optional destination FK, subject<=160, message<=2000, status NEW/IN_PROGRESS/CLOSED, timestamps.

User/session delete cascades only owned auth/account rows; references content Restrict. Constraints/indexes cho hash, email, user+createdAt, expiry, bounds. P3 old migrations immutable; P4 thêm migration riêng. Test reset qualified fixed 14 tables trong guarded transaction, NO CASCADE. Không reset dev. Đối chiếu content CHECK trong P3 giữ nguyên khi Prisma generate/migrate.

Account collections: tối đa 50 favorites và 50 saved itineraries/user, add idempotent, reject overflow typed409; cap kiểm trong serializable transaction. Khi thêm mục public mới, transaction dọn chỉ các bookmark của đúng user đã ẩn do nội dung không còn public trước khi đếm; việc archive có thể làm mất bookmark cũ nhưng tránh tài khoản bị kẹt ở cap không thể sửa từ UI. GET trả <=50 theo createdAt DESC/id DESC. Inquiries GET pagination page1+, limit20 (max50), bounded offset<=10000, user-scoped, no arbitrary userId. Tạo inquiry cần user, rate limit5/min/user ID, không gửi email/Telegram và không thực hiện booking.

## API contracts

Namespace /api/v1. Errors giữ envelope {error:{code,message,details?},requestId}. Never return password/token hashes/session secrets. Unknown query/body keys reject. Dates ISO UTC.

| Method/path | Input/output | Policy |
|---|---|---|
| GET /auth/csrf | {csrfToken} | public no-store |
| POST /auth/register | {name,email,password} -> {user} 201 + cookies | public, CSRF/rate |
| POST /auth/login | {email,password} -> {user} 200 + cookies | public, generic invalid credentials, CSRF/rate |
| POST /auth/refresh | {} -> {user} 200 + rotated cookies | valid refresh, CSRF/rate |
| POST /auth/logout | {} -> 204 + clear cookies | idempotent, CSRF |
| GET /auth/me | {user} | active access |
| PATCH /me/profile | {name} -> {user} | active access, CSRF |
| POST /me/change-password | {currentPassword,newPassword} -> 204 + clear | active access, CSRF, revoke all |
| GET /me/sessions | {data:[{id,createdAt,expiresAt,current}]} | active access, own, max50 |
| DELETE /me/sessions/:id | 204 | own, CSRF, hidden/unknown404 |
| GET /me/favorites | {data:[{id,createdAt,destination}]} | active user; omit nonpublic content |
| PUT /me/favorites/:slug | 204 idempotent | published destination, CSRF |
| DELETE /me/favorites/:slug | 204 idempotent | own only, CSRF |
| GET /me/saved-itineraries | {data:[{id,createdAt,itinerary}]} | own; omit nonpublic |
| PUT /me/saved-itineraries/:slug | 204 idempotent | published itinerary, CSRF |
| DELETE /me/saved-itineraries/:slug | 204 idempotent | own only, CSRF |
| GET /me/inquiries?page=&limit= | {data,pagination:{page,limit,hasMore}} | own only |
| POST /me/inquiries | {subject,message,destinationSlug?} -> {inquiry} 201 | active user, CSRF/rate |
| GET /admin/access | {allowed:true,role} | EDITOR or ADMIN |
| GET /admin/users/access | {allowed:true,role} | ADMIN only; no user CRUD |

user = {id,email,name,role,createdAt}; destination/itinerary references = {slug,title,excerpt}. inquiry = {id,subject,message,status,createdAt,updatedAt,destination:null|{slug,title}}. Hidden resource behaves unknown404. No public mutation/content publish in P4.

Rate: login8/min/normalized-email-hash, register4/min/normalized-email-hash, inquiry5/min/authenticated-user-ID; IP coarse backstop login120/register60/refresh300 per minute. Map bounded<=10000 keys with TTL pruning, Argon2 hash operations cap4 concurrent ->429 when saturated. No trust proxy/XFF without explicit deployment config. Email-specific throttling can temporarily block one targeted account; multi-instance abuse defense/CAPTCHA belongs in deployment hardening. Invalid credentials generic401, duplicate email generic409; no account enumeration endpoint. Self-registration never promotes role. Bootstrap admin optional CLI reads explicit env credentials, rejects missing/weak and existing conflicting user; no secrets printed or seeded by default.

## Frontend

Functional login/register with controlled pending/error states, no browser storage secrets, safe next allowlist (local / prefix, reject //, backslash, encoded bypass), loading and account session context. Browser apiFetch serializes refresh then retry ONCE on401; auth/login/register/refresh excluded recursive retry. csrf fetched only in memory; onCSRF expiry refresh token once and retry unsafe request only on403CSRF_INVALID (before mutation). Abort/cancel stale account loads.

Account/profile page edit name; favorites/saved itinerary choose actual published content from public list; inquiry form/history; security change password/sessions/revoke/logout. Empty DB -> honest empty state. Protected route boundary shows no private child data until session confirmed. Guest redirect sign-in; USER admin403; EDITOR no users/audit sensitive module; backend repeats RBAC. Admin content CMS remains disabled P5 shell with clear current capability, no pretend CRUD.

## Ownership/write boundaries

Root: project docs/control/README/.env.example, shared contracts if needed, dependency lock/install, migration integration, test harness reset list, verification and process cleanup.
Auth/backend worker: apps/api/src/modules/auth/** (new), apps/api/src/modules/me/** (new), apps/api/prisma/schema.prisma + one new P4 migration, apps/api/src/app.module.ts/app.setup.ts, optional prisma/bootstrap-admin.ts and auth tests/config/script. No existing P3 content routes/migration/schema semantics edits.
Web worker: apps/web/src/features/auth/**, features/account/**, API BFF route/server helper, auth/account/admin layouts/pages, shared header/mobile/desktop nav. No cinematic/assets/font/photo changes, no public content source rewrite.

Before editing, refresh current disk. Preserve concurrent work; root integrates package/config overlap. All project ledger Entries000..012 immutable. P3 repair fixes occur first, each with independent evidence; P4 must not hide a P3 failure.

## Gates and completion

1. P3 final root gates: unit/content/health/static, actualwrapper matrix, migration fresh/preflight/latefailure, scoped frozen hash; record repaired bounded checks/rawpath/testboundary.
2. P4 schema/route/security contract (this doc), then auth backend and web in independent write sets.
3. Owned PostgreSQL fresh migrations and existing compliant additive deploy, seed idempotence, constraints and scopedreset.
4. Auth tests realPG: register roleinjection, duplicate, wrongpassword, cookiesflags, missing/wrongCSRF/origin, expired/revoked/disabled access, rotate/replay inclconcurrent, logout/passwordchange, ownership/IDOR, USER/EDITOR/ADMIN matrix, collection hiddencontent and idempotence/caps, inquiryhistory pagination.
5. Root lint/typecheck/unit/content/auth/e2e/APIbuild + isolated currentweb productionbuild. No overwrite existing port3000 runtime/artifacts for verification.
6. Browser actual registration/login/profile/save/inquiry/logout, mobile320/375/768/desktop1440, header route URL+H1+back/forward/nooverflow, guestaccountredirect/USERadmin403, sessionreload/refresh. Preserve hero and accessibility controls.
7. Read final diff/hashes, independent auth/security review, repair findings, append handoff with exact paths/evidence/risks. P4 final IMPLEMENTED_UNREVIEWED unless separately independently verified. No startP5.

## Risks and remaining phases

Deployment HTTPS/cookie/host configuration, physicalmobile/crossbrowser and distributedlimits P7. No email verification/reset-password transport in P4 because no providerauthorized/configured; no misleading forgotpassword form. P5 CMS still needed to add verified content/provisionroles through UI; P6 binds allpublicpages/search/map. License/location of original hero remainunverified forrelease. Single-instance in-memorylimit bounded but resets onrestart. Keep testresults/credentials outside source; never storesecrets in projectdocs.

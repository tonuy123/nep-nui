# P7 — Hardening, deployment và demo (báo cáo handoff)

Trạng thái: `IMPLEMENTED_UNREVIEWED` — local production demo ready, chờ Paw/Codex review.

> **Ghi chú ledger:** phase P4c (auth UI mở rộng) đang được một phiên khác viết dở
> trong `AI_PROJECT_CONTROL.md` tại thời điểm hoàn tất P7. Vì vậy entry P7 chưa
> được append vào ledger để tránh hai writer cùng file; nội dung entry đầy đủ
> nằm trong tài liệu này và cần được append vào §13 khi cây chính ổn định.

## Phạm vi đã giao

| Hạng mục | Kết quả |
|---|---|
| Tích hợp | Branch `feat/header-service-pages` (header mới + 5 trang dịch vụ template) merge fast-forward vào `main` tại `c3e59af`; baseline P4/P5/P6/P4c snapshot `d2ae80f` trước hardening |
| Security review | `npm audit --omit=dev`: 4 high qua prisma transitive (deepmerge-ts, mysql2) — fix đòi downgrade Prisma (breaking) nên giữ, ghi known risk; repo không có secret (chỉ `RECAPTCHA_SECRET_KEY` env name + `.env.example` giả); security headers mới cho web + API (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), bỏ `X-Powered-By` (`caad032`); RBAC probe: admin API guest 401, BFF allowlist chặn path lạ 404 |
| Performance/bundle | Budget §8: LCP mobile 80–280 ms / desktop 92–256 ms (đo lab, budget <2500 ms); CLS ≤ 0.0008 (budget <0.1); initial JS mobile 155 KB gzip (budget <180 KB), desktop 187 KB (vượt 4%, ghi nhận); trang chủ nặng nhất (hero + carousel + video metadata) |
| Accessibility | axe-core WCAG 2.0/2.1 AA trên **20 route** (gồm cả trang auth P4c: đăng ký, quên/đặt lại mật khẩu, chính sách, điều khoản): **0 serious/critical** (trước fix: 20 violation — contrast gold/forest, ink/45–60 nhỏ, earth/55, scrollable region). Fix bằng token `--color-gold-light` + tăng opacity text phụ + `tabIndex` cho weather track (`c968e72`, 19 file) + follow-up 3 chỗ `text-ink/60→70` ở trang auth |
| Cross-browser | Chrome + Edge headless: 31/31 checks mỗi browser (routes, header nav, active state, hero ảnh, breadcrumb, facts, closing CTA, admin redirect, mobile menu Escape, no-overflow 390 px). Firefox: **chưa chạy** — tải browser 2 lần fail do mạng (cdn.playwright.dev timeout), ghi known limitation |
| Demo scripts | `scripts/demo/start-demo.ps1` / `stop-demo.ps1` — docker compose up → migrate deploy → build (skip được) → API + web production → health wait → lưu PID; đã chạy thật với `-SkipBuild -DistDir .next-p7` và verify 31/31 sau đó |
| Backup/restore | `pg_dump -Fc` dev DB → `pg_restore` scratch DB → counts khớp source (destinations 10=10, media 16=16, migrations 6) → drop scratch |

## Bằng chứng (commands)

- Gates: `npm run lint` 0 · `typecheck` 0 · `test` 0 (unit + health/OpenAPI) · `test:content` 50/50 ·
  `test:admin` 7/7 · `test:auth` 22/22 · `build` 0 (contracts → api → web, 43 routes).
- Fix gate P4c trong lúc tích hợp: `apps/api/test/auth.e2e-spec.ts` lint/type (`f3c20c7`);
  migrate deploy `20260929093000_p4c_auth_expansion` lên test DB (additive) — dev DB đã sẵn.
- Security: `curl -I` web/API sau `caad032` xác nhận headers; `curl` admin API → 401; BFF path lạ → 404.
- Perf/a11y/smoke scripts chạy ngoài repo tại `C:\Users\DELL\AppData\Local\Temp\opencode\p7tools`
  (`verify.mjs`, `axe-scan.mjs`, `perf-probe.mjs`, `console-probe.mjs`) — không thêm dependency vào repo
  (playwright-core + axe-core trong temp dir).
- Demo: `powershell -ExecutionPolicy Bypass -File scripts/demo/start-demo.ps1 -SkipBuild -DistDir .next-p7`
  → READY, web `http://127.0.0.1:8080`, API `http://127.0.0.1:3201/api/v1/health`.
- Backup drill: `docker exec webdulich-postgres-dev pg_dump -U webdulich -d webdulich_dev -Fc -f /tmp/p7_backup.dump`
  → create scratch → `pg_restore` → counts khớp → drop scratch (tất cả exit 0).

## Kịch bản demo (gợi ý)

1. Trang chủ: cinematic hero → carousel 10 điểm đến → khối thời tiết realtime → video giới thiệu.
2. Menu: 5 mục → mỗi trang có hero ảnh + "Điều cần biết" + công cụ lập kế hoạch + CTA cuối.
3. `/kham-pha` lọc theo tỉnh/từ khóa → mở bài Sa Pa (highlights, nguồn ảnh, JSON-LD).
4. Đăng nhập demo → lưu yêu thích → gửi yêu cầu tư vấn trong `/tai-khoan`.
5. Admin (`/admin`, tài khoản bootstrap): dashboard, sửa nội dung, publish, audit log.
6. Fallback: Open-Meteo lỗi → khối thời tiết tự ẩn; API lỗi → trang hiển thị `ContentUnavailable`;
   DB down → API 503 sạch (không lộ stack); toàn bộ asset tĩnh local, không phụ thuộc CDN.

## Known risks (giữ tới release)

- Media UNVERIFIED: ảnh hero P2 + video intro do Paw cung cấp chưa có bằng chứng quyền — chấp nhận cho demo local, chặn public release.
- Firefox chưa verify (mạng không tải được), thiết bị di động thật chưa đo (chỉ viewport 390 headless).
- Desktop initial JS vượt budget nhẹ (187 KB vs 180 KB gzip).
- `npm audit`: 4 high qua Prisma transitive — chờ upstream, không downgrade breaking.
- Rate limit in-memory per instance (đủ cho demo, cần distributed trước deploy thật).
- P4b/P5/P6/P4c là unreviewed khi P7 verify; nếu phase khác sửa tiếp cây chính, cần rebuild + rescan.

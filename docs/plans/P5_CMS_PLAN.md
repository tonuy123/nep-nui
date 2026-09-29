# P5 — Admin/Editor CMS plan và contract

Trạng thái: `IMPLEMENTED_UNREVIEWED` — source + gates + browser evidence tại
Entry 018 của `AI_PROJECT_CONTROL.md`. Codex/Paw chưa review độc lập.

## Phạm vi đã giao

Admin/Editor quản lý nội dung qua dashboard, đúng completion criterion của P5:
"Editor/Admin matrix đúng, content publish xuất hiện ở public API, unauthorized
mutation bị từ chối."

| Hạng mục | Cách làm |
|---|---|
| CRUD 5 loại nội dung | Địa danh, trải nghiệm, hành trình, chuyện bản địa, cẩm nang |
| Publish workflow | Tái dùng `PublicationService` (DRAFT→PUBLISHED, PUBLISHED→ARCHIVED) + thêm `restore` (ARCHIVED→DRAFT) |
| Media | Thư viện metadata + trạng thái xác minh; upload thật chờ quyết định provider (§14 master) |
| Yêu cầu tư vấn | Inbox, đổi trạng thái, ghi chú nội bộ, mốc xử lý đầu tiên |
| Người dùng | ADMIN-only: đổi vai trò, khóa/mở khóa (khóa thu hồi mọi phiên) |
| Audit log | Bảng `audit_logs` mới, ghi mọi mutation kèm actor/action/resource/summary |
| Tổng quan | Đếm theo trạng thái, hoạt động gần đây, yêu cầu mới nhất |

## API contract (prefix `/api/v1`)

RBAC: `@Roles("EDITOR","ADMIN")` cho nội dung/media/yêu cầu/tổng quan;
`@Roles("ADMIN")` cho người dùng/audit. Guards: Auth + Roles + CSRF.

```text
GET    /admin/overview                              { data: AdminOverview }
GET    /admin/options                               { data: { destinations, media } }
GET    /admin/content/{resource}?status&q&page&limit
GET    /admin/content/{resource}/{id}
POST   /admin/content/{resource}
PATCH  /admin/content/{resource}/{id}
DELETE /admin/content/{resource}/{id}               (204; chặn nếu PUBLISHED)
POST   /admin/content/{resource}/{id}/publish|archive|restore
PUT    /admin/content/destinations/{id}/gallery     { mediaIds: string[] }
GET    /admin/media?clearance&q&page&limit
POST   /admin/media | PATCH /admin/media/{id} | DELETE /admin/media/{id}
GET    /admin/inquiries?status&page&limit | PATCH /admin/inquiries/{id}
GET    /admin/users?role&status&q&page&limit | PATCH /admin/users/{id}   (ADMIN)
GET    /admin/audit-logs?resource&page&limit                             (ADMIN)
```

Quy tắc nghiệp vụ chính:

- Slug unique; content PUBLISHED không đổi slug, không xóa (phải lưu trữ trước).
- Xóa content còn tham chiếu (FK Restrict) → 409 `CONTENT_IN_USE`; media đang
  dùng → 409 `MEDIA_IN_USE`; publish thiếu điều kiện → 422 `PUBLICATION_NOT_ALLOWED`
  (chi tiết field); đổi slug trùng → 409 `SLUG_TAKEN`.
- Người dùng: không tự đổi vai trò/trạng thái (`USER_SELF_UPDATE`), không hạ
  quyền admin hoạt động cuối cùng (`LAST_ADMIN`), khóa thu hồi phiên.
- Mọi mutation ghi `audit_logs`; publish/archive/restore dùng transaction
  SERIALIZABLE sẵn có của PublicationService.
- Media upload thật chưa làm: provider object storage là open decision §14,
  chưa được Paw chốt — không tự bịa adapter.

## BFF (web → API)

`apps/web/src/lib/auth/bff.ts` mở rộng allowlist chính xác cho `admin/*`:
chỉ path đã liệt kê, id phải là UUID, method theo bảng, query theo từng route,
body limit 16 KiB (64 KiB cho POST/PATCH `admin/content/*` vì body tối đa
20.000 code points). Request không body không còn bị ép `Content-Type` JSON.

## Admin UI (web)

- `/admin` tổng quan; 5 route content dùng chung `AdminContentManager` +
  `ContentEditor` (form theo config resource); `/admin/media`,
  `/admin/yeu-cau`, `/admin/nguoi-dung` (ADMIN), `/admin/audit-log` (ADMIN).
- Media picker dùng `<dialog>` native (Escape/backdrop đóng), bảng desktop +
  card mobile, trạng thái/hành động theo vòng đời, xác nhận xóa.
- Không icon trang trí, không copy thừa; nhãn tiếng Việt nêu đúng tác vụ.

## Bằng chứng

- `npm run lint` 0, `npm run typecheck` 0, `npm run test` 0 (118 unit +
  3 health/OpenAPI), `npm run test:admin` 0 (7/7 trên PostgreSQL thật),
  `npm run build` 0 (contracts → API → web, 43 page outputs, build web cô lập
  qua `NEXT_DIST_DIR` để không đụng `.next` của process 3000).
- Browser (Chrome headless, production build cô lập, port 3100 + API 3001):
  25/25 check — lifecycle địa danh + cover/media + publish + public API,
  filter/tìm kiếm, audit, users self-guard, RBAC USER bị chặn, keyboard
  Escape, no overflow 390px, 0 console/page error. Screenshot tại
  `D:\codex-task-temp\p5-verify\`.

## Giới hạn

- Chưa có test unit cho allowlist BFF (được phủ bằng browser E2E qua BFF thật).
- Ít ảnh preview phụ thuộc URL media; upload/processing chờ provider.
- `audit_logs` chưa có retention/export; chỉ đọc trong UI.

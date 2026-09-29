# P6 — Public data integration, map fallback và journey UX

Trạng thái: `IMPLEMENTED_UNREVIEWED` — source + gates + browser evidence tại
Entry 019 của `AI_PROJECT_CONTROL.md`.

## Phạm vi đã giao

| Hạng mục | Cách làm |
|---|---|
| Dữ liệu công khai thật | Mở rộng `destinations` với `province`, `landscape`, `travelNote`, `highlights[]`, `sourceUrl` (migration additive `20260929073424_p6_destination_editorial`); seed 10 địa danh Tây Bắc từ dữ liệu biên tập P4b kèm nguồn và ảnh có attribution (16 media CLEARED) |
| Bind public pages | `/kham-pha`, `/diem-den/[slug]`, `/trai-nghiem`(+detail), `/hanh-trinh`(+detail), `/chuyen-ban-dia`(+detail), `/cam-nang`(+detail), `/ban-do` đọc trực tiếp content API qua server-side client (`lib/content/api.ts`, `no-store`, timeout 6s, React cache dedupe) |
| Loading/empty/error | Mỗi trang có trạng thái lỗi tải (`ContentUnavailable`), rỗng trung thực (`ContentEmpty`), 404 cho slug không tồn tại |
| Search/filter | `/kham-pha`: lọc theo từ khóa + tỉnh/thành (GET form, hoạt động không cần JS); `/trai-nghiem`: lọc theo địa danh |
| Save/inquiry end-to-end | Nút lưu yêu thích trên bài địa danh, lưu hành trình trên bài hành trình (server biết session, guest thấy CTA đăng nhập ngay — không gọi API thừa); gửi yêu cầu tư vấn ở `/tai-khoan/yeu-cau-tu-van` |
| Map | `/ban-do` liệt kê điểm đến theo tỉnh/thành + sơ đồ minh họa; **bản đồ tương tác chờ quyết định nhà cung cấp tile (§14)** — không tự chọn provider |
| SEO | `generateMetadata` theo dữ liệu thật + OpenGraph; JSON-LD `TouristAttraction` (địa danh) và `TouristTrip` (hành trình) |
| CMS | Editor địa danh có thêm field tỉnh/thành, dấu ấn, gợi ý khám phá (mỗi dòng một gợi ý), lưu ý trước chuyến đi, nguồn tham khảo |

## Quyết định dữ liệu

- Seed chuyển 10 địa danh P4b (đã có nguồn du lịch + ảnh CC0/Unsplash/CC BY-SA
  ghi tại `/nguon-anh`) vào CMS làm nguồn công khai. Đây là thay đổi chính sách
  so với "seed rỗng" của P3 và cần Paw xác nhận khi review.
- Seed idempotent: destination tồn tại theo slug thì bỏ qua (không ghi đè nội
  dung đang biên tập); media tái dùng theo `publicUrl`.
- 2 địa danh không có ảnh phù hợp (Ngọc Chiến, Sin Suối Hồ) giữ minh họa web,
  ghi rõ "Minh họa do dự án tự vẽ".
- Trải nghiệm/hành trình/câu chuyện/cẩm nang chưa có nội dung đã kiểm chứng →
  API trả rỗng và trang hiển thị empty state trung thực; CMS sẵn sàng để biên
  tập (không bịa lịch trình/chi phí).

## Bằng chứng

- `npm run lint` 0, `npm run typecheck` 0, `npm run test` 0 (119 unit +
  3 health/OpenAPI), `test:content` 0 (50/50 trên PostgreSQL thật, gồm parity
  OpenAPI YAML ↔ runtime sau khi thêm field), `test:admin` 0 (7/7), `npm run
  build` 0 (contracts → API → web; web build cô lập `NEXT_DIST_DIR`).
- Browser Chrome production (web 3100, API 3001, DB scratch có seed):
  **28/28 check** — list 10 điểm đến, lọc từ khóa 1 / lọc tỉnh 3 / empty state,
  chi tiết Sa Pa (highlights, travel note, ảnh tải thật, attribution, JSON-LD),
  guest CTA đăng nhập, đăng ký + lưu yêu thích + thấy trong tài khoản, gửi yêu
  cầu tư vấn end-to-end, empty state 4 trang nội dung, bản đồ theo tỉnh, 404
  slug lạ, 0 overflow 390px trên 3 trang, 0 lỗi console/page (ngoài 401 probe
  guest theo thiết kế P4). Screenshot `D:\codex-task-temp\p6-verify\`.

## Giới hạn

- Bản đồ tương tác và POI coordinates chờ provider (§14).
- Nội dung experiences/itineraries/stories/guides do CMS cung cấp; hiện rỗng.
- Bài P4b tĩnh cho carousel trang chủ vẫn dùng dữ liệu TS cục bộ (chưa bind
  homepage carousel để tránh xung đột phiên P4b đang mở).
- Chưa có unit test cho `lib/content/api.ts`; phủ bằng browser E2E.

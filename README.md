# Nếp Núi — Website quảng bá du lịch Tây Bắc

Website quảng bá du lịch vùng sâu, vùng xa Tây Bắc Việt Nam:

- **Trang public**: trang chủ, điểm đến, trải nghiệm, hành trình, chuyện bản
  địa, cẩm nang, bản đồ Tây Bắc, nguồn ảnh, giỏ hàng.
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

## Chạy dự án

Hướng dẫn chạy **từng bước từ số 0 đến tài khoản admin** nằm ở
**[runweb.md](runweb.md)** — gồm: cài đặt, database, chạy web (demo 1 lệnh /
dev / production), tạo ADMIN, cấu hình tùy chọn OAuth-SMTP-reCAPTCHA, kiểm thử
và xử lý sự cố.

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

---

Monorepo dùng **npm workspaces**. Không dùng pnpm; không thêm task runner
ngoài các script trong `package.json`.

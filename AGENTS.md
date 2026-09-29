# Webdulich — hướng dẫn riêng cho repo

- Sản phẩm là website quảng bá cảnh quan và văn hóa vùng núi Tây Bắc Việt Nam. Giữ thiết kế nguyên bản; website tham khảo chỉ là tư liệu về luồng UX, không phải mẫu để sao chép.
- `AI_PROJECT_CONTROL.md` giữ brief cuộc thi, kiến trúc, phase và handoff. Đối chiếu phần liên quan với source/Git hiện tại; chỉ thị mới nhất của Paw thắng snapshot cũ. Không tự mở phase mới từ một báo cáo chưa được review.
- Trước khi sửa file, kiểm tra Git status và quyền sở hữu write-set. Repo có thể có nhiều người viết cùng lúc; chỉ một người sửa một file, giữ nguyên phần đang làm của người khác.
- Monorepo dùng npm workspaces: `apps/web` (Next.js), `apps/api` (NestJS/Prisma/PostgreSQL), `packages/contracts` (kiểu dữ liệu chung). Xem `package.json` và README để lấy command hiện tại; không đoán từ bản handoff cũ.
- Nội dung du lịch phải có nghĩa và kiểm chứng được. Không bịa dữ kiện địa phương, giá, đường đi hoặc điều kiện an toàn; kiểm tra quyền sử dụng và attribution của ảnh/video/font/bản đồ trước khi xuất bản.
- UI phải dùng được trên mobile, bàn phím và khi reduced motion bật. Asset lớn và hiệu ứng cinematic cần fallback nhẹ; kiểm tra trên browser ở các viewport bị ảnh hưởng.
- Khi thay đổi phase, architecture hoặc contract, cập nhật phần tương ứng trong `AI_PROJECT_CONTROL.md` và ghi evidence/handoff theo quy trình của dự án. Với sửa hẹp, giữ báo cáo tương xứng phạm vi.

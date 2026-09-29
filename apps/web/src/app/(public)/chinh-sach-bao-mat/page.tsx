import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo vệ dữ liệu cá nhân",
  description: "Dữ liệu cá nhân website thu thập, mục đích sử dụng và quyền của người dùng.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl text-forest-deep">Chính sách bảo vệ dữ liệu cá nhân</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-ink/80 sm:text-base">
        <section>
          <h2 className="font-display text-2xl text-forest">Dữ liệu thu thập</h2>
          <p className="mt-2">
            Khi tạo tài khoản, hệ thống lưu họ tên, email, số điện thoại, tỉnh/thành và phường/xã (nếu bạn
            cung cấp). Khi sử dụng, hệ thống lưu danh sách địa điểm yêu thích, hành trình đã lưu và yêu cầu
            tư vấn bạn gửi.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-forest">Mục đích sử dụng</h2>
          <p className="mt-2">
            Dữ liệu dùng để vận hành tài khoản, hiển thị nội dung bạn đã lưu và phản hồi yêu cầu tư vấn.
            Hệ thống không bán dữ liệu cá nhân và không dùng cho quảng cáo bên thứ ba.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-forest">Bảo mật</h2>
          <p className="mt-2">
            Mật khẩu được băm bằng Argon2id và không lưu dạng văn bản. Phiên đăng nhập dùng token quay vòng;
            khóa tài khoản sẽ thu hồi mọi phiên. Bạn có thể đổi mật khẩu và thu hồi phiên trong mục Bảo mật
            của tài khoản.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-forest">Quyền của bạn</h2>
          <p className="mt-2">
            Bạn có thể xem, sửa họ tên, gỡ địa điểm/hành trình đã lưu và yêu cầu xóa tài khoản bằng cách liên
            hệ ban quản trị website. Yêu cầu xóa sẽ được xử lý trong thời gian sớm nhất.
          </p>
        </section>
      </div>
    </article>
  );
}

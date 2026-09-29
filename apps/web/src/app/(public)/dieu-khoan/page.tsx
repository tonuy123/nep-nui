import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Quy định sử dụng tài khoản và nội dung trên website.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl text-forest-deep">Điều khoản sử dụng</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-ink/80 sm:text-base">
        <section>
          <h2 className="font-display text-2xl text-forest">Tài khoản</h2>
          <p className="mt-2">
            Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động trên tài khoản của mình. Không dùng tài
            khoản để đăng nội dung sai lệch, quấy rối hoặc gửi yêu cầu tư vấn với mục đích spam.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-forest">Nội dung website</h2>
          <p className="mt-2">
            Nội dung điểm đến được biên tập kèm nguồn tham khảo; ảnh có ghi tác giả và giấy phép tại bài viết
            và mục Nguồn ảnh. Thông tin hành trình, chi phí và an toàn chỉ mang tính gợi ý; hãy kiểm tra lại
            với nguồn chính thức trước khi lên đường.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-forest">Giới hạn</h2>
          <p className="mt-2">
            Website không cung cấp dịch vụ đặt chỗ, thanh toán hoặc xác nhận tồn kho. Yêu cầu tư vấn bạn gửi
            là đề nghị liên hệ, không phải hợp đồng đặt dịch vụ.
          </p>
        </section>
      </div>
    </article>
  );
}

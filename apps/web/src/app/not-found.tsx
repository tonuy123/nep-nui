import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth">
        Lỗi 404
      </p>
      <h1 className="font-display text-2xl font-semibold text-forest">
        Không tìm thấy trang
      </h1>
      <p className="text-sm leading-relaxed text-ink/75">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold/90"
        >
          Về trang chủ
        </Link>
        <Link
          href="/kham-pha"
          className="rounded-md border border-forest/30 px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest/10"
        >
          Khám phá điểm đến
        </Link>
      </div>
    </main>
  );
}

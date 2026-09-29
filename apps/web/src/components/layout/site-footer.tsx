import Link from "next/link";
import { primaryNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-forest/15 bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl font-normal">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/80">
            {siteConfig.description}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-ivory/70">
            Mỗi hành trình bắt đầu bằng sự tò mò và sự tôn trọng với vùng đất,
            con người nơi mình đặt chân đến.
          </p>
          <Link href="/nguon-anh" className="mt-4 inline-flex min-h-11 items-center text-xs text-ivory/85 underline underline-offset-4 hover:text-white">
            Nguồn và giấy phép ảnh
          </Link>
        </div>

        <nav aria-label="Liên kết khám phá ở chân trang">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            Lên kế hoạch
          </h2>
          <ul className="mt-3 space-y-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ivory/90 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Liên kết tài khoản ở chân trang">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            Tài khoản
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/dang-nhap"
                className="text-sm text-ivory/90 transition-colors hover:text-white"
              >
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link
                href="/dang-ky"
                className="text-sm text-ivory/90 transition-colors hover:text-white"
              >
                Đăng ký
              </Link>
            </li>
            <li>
              <Link
                href="/tai-khoan"
                className="text-sm text-ivory/90 transition-colors hover:text-white"
              >
                Trang cá nhân
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-ivory/70 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {siteConfig.name}.
        </p>
      </div>
    </footer>
  );
}

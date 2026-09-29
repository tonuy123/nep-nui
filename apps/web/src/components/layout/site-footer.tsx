import Image from "next/image";
import Link from "next/link";
import { contactConfig } from "@/config/contact";
import { primaryNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-forest/15 bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-center sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex flex-col items-center">
          <Image
            src="/brand/nep-nui-logo-dark.svg"
            alt="Nếp Núi"
            width={146}
            height={44}
            unoptimized
            className="h-11 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/80">
            {siteConfig.description}
          </p>
          <address className="mt-4 space-y-1 text-xs not-italic leading-5 text-ivory/75">
            <span className="block">{contactConfig.address}</span>
            <a
              href={`tel:${contactConfig.phone.replace(/[^+0-9]/g, "")}`}
              className="block transition-colors hover:text-white hover:underline hover:underline-offset-4"
            >
              Hotline: {contactConfig.phone}
            </a>
            <a
              href={`mailto:${contactConfig.email}`}
              className="block transition-colors hover:text-white hover:underline hover:underline-offset-4"
            >
              {contactConfig.email}
            </a>
          </address>
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
        <p className="mx-auto max-w-6xl px-4 py-3 text-center text-xs text-ivory/70 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {siteConfig.name}.
        </p>
      </div>
    </footer>
  );
}

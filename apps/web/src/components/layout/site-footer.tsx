import Image from "next/image";
import Link from "next/link";
import { primaryNav, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const exploreLinks: NavItem[] = [
  { label: "Điểm đến", href: "/kham-pha" },
  { label: "Bản đồ Tây Bắc", href: "/ban-do" },
  { label: "Chuyện bản địa", href: "/chuyen-ban-dia" },
  { label: "Cẩm nang", href: "/cam-nang" },
];

const informationLinks: NavItem[] = [
  { label: "Về Nếp Núi", href: "/#about-heading" },
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Điều khoản sử dụng", href: "/dieu-khoan" },
  { label: "Nguồn và giấy phép ảnh", href: "/nguon-anh" },
];

function FooterLinks({ title, links, className = "" }: {
  title: string;
  links: NavItem[];
  className?: string;
}) {
  return (
    <nav aria-label={`${title} ở chân trang`} className={className}>
      <h2 className="border-b border-ivory/20 pb-4 text-sm font-semibold uppercase tracking-[0.08em] text-gold-light">
        {title}
      </h2>
      <ul className="mt-3">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center py-2 text-sm leading-6 text-ivory/90 transition-colors hover:text-gold-light hover:underline hover:underline-offset-4"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer id="site-footer" className="border-t border-ivory/15 bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 pl-5 pr-20 py-12 sm:pl-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16 lg:pl-8 lg:py-20 2xl:pr-8">
        <div>
          <Link href="/" aria-label="Nếp Núi — trang chủ" className="inline-flex">
            <Image
              src="/brand/nep-nui-logo-dark.svg"
              alt="Nếp Núi"
              width={216}
              height={65}
              unoptimized
              className="h-auto w-54"
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-ivory/80">
            Điểm đến, chuyện bản địa và gợi ý hành trình vùng núi Tây Bắc.
          </p>
          <Link
            href="/tai-khoan/yeu-cau-tu-van"
            className="mt-6 inline-flex min-h-11 items-center gap-5 rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            Gửi yêu cầu tư vấn
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-x-8">
          <FooterLinks title="Khám phá" links={exploreLinks} />
          <FooterLinks title="Chuyến đi" links={primaryNav} />
          <FooterLinks title="Thông tin" links={informationLinks} className="col-span-2 sm:col-span-1" />
        </div>
      </div>

      <div className="bg-forest-deep text-ivory">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 pl-5 pr-20 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pl-6 lg:pl-8 2xl:pr-8">
          <p className="text-xs leading-6 text-ivory/85">
            © {new Date().getFullYear()} {siteConfig.name}. <span className="ml-2">Tây Bắc, Việt Nam.</span>
          </p>
          <nav aria-label="Tài khoản ở chân trang" className="flex flex-wrap gap-x-6">
            {[
              { label: "Đăng nhập", href: "/dang-nhap" },
              { label: "Đăng ký", href: "/dang-ky" },
              { label: "Tài khoản", href: "/tai-khoan" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center text-xs text-ivory/90 hover:text-gold-light hover:underline hover:underline-offset-4">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

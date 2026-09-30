import Image from "next/image";
import Link from "next/link";
import { contactConfig } from "@/config/contact";
import { siteConfig } from "@/config/site";

const informationLinks = [
  { label: "Về Nếp Núi", href: "/#about-heading" },
  { label: "Điểm đến", href: "/kham-pha" },
  { label: "Bản đồ Tây Bắc", href: "/ban-do" },
  { label: "Chuyện bản địa", href: "/chuyen-ban-dia" },
  { label: "Cẩm nang", href: "/cam-nang" },
  { label: "Nguồn và giấy phép ảnh", href: "/nguon-anh" },
];

const legalLinks = [
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Điều khoản sử dụng", href: "/dieu-khoan" },
];

function FooterLinks({ title, links, className = "" }: {
  title: string;
  links: { label: string; href: string }[];
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

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3.5A1 1 0 0 1 4 2.5h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

export function SiteFooter() {
  const showFacebook = contactConfig.facebookUrl.trim().length > 0;
  const showZalo = contactConfig.zaloUrl.trim().length > 0;

  return (
    <footer id="site-footer" className="border-t border-ivory/15 bg-forest text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 pl-5 pr-20 py-12 sm:pl-6 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)_minmax(0,.85fr)] lg:gap-12 lg:pl-8 lg:py-20 2xl:pr-8">
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

          <p className="mt-6 text-sm font-semibold leading-6 text-ivory">
            Công ty Cổ phần Du lịch Nếp Núi
          </p>
          <ul className="mt-4 space-y-2.5 text-sm leading-6 text-ivory/85">
            <li className="flex items-start gap-2.5">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-5.75-7-11a7 7 0 0 1 14 0c0 5.25-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {contactConfig.address}
            </li>
            <li className="flex items-start gap-2.5">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <a href={`mailto:${contactConfig.email}`} className="transition-colors hover:text-gold-light hover:underline hover:underline-offset-4">
                {contactConfig.email}
              </a>
            </li>
          </ul>

          {showFacebook || showZalo ? (
            <>
              <p className="mt-7 text-xs uppercase tracking-[0.12em] text-ivory/70">
                Theo dõi chúng tôi trên:
              </p>
              <div className="mt-3 flex items-center gap-3">
                {showFacebook ? (
                  <a
                    href={contactConfig.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Nếp Núi"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1.5 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
                  >
                    <Image src="/images/contact/facebook.svg" alt="" width={32} height={32} unoptimized className="h-full w-full" />
                  </a>
                ) : null}
                {showZalo ? (
                  <a
                    href={contactConfig.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zalo Nếp Núi"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1.5 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
                  >
                    <Image src="/images/contact/zalo.svg" alt="" width={32} height={32} unoptimized className="h-full w-full" />
                  </a>
                ) : null}
              </div>
            </>
          ) : null}

          <a
            href={`tel:${contactConfig.phone.replace(/[^+0-9]/g, "")}`}
            className="mt-7 inline-flex min-h-11 items-center gap-2.5 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            <PhoneIcon />
            {contactConfig.phone}
          </a>
          <p className="mt-2 text-xs text-ivory/70">Hotline tư vấn</p>
        </div>

        <FooterLinks title="Thông tin" links={informationLinks} />
        <FooterLinks title="Điều kiện - Điều khoản" links={legalLinks} />
      </div>

      <div className="bg-forest-deep text-ivory">
        <div className="mx-auto max-w-6xl space-y-1 px-5 py-5 text-center sm:px-6 lg:px-8">
          <p className="text-xs leading-6 text-ivory/85">
            Bản quyền của {siteConfig.name} © {new Date().getFullYear()}. Bảo lưu mọi quyền.
          </p>
          <p className="text-xs leading-6 text-ivory/85">
            Ghi rõ nguồn &quot;nepnui.vn&quot; khi sử dụng lại thông tin từ website này.
          </p>
          <p className="text-xs leading-6 text-ivory/85">
            Hotline: {contactConfig.phone} · Email: {contactConfig.email}
          </p>
        </div>
      </div>
    </footer>
  );
}

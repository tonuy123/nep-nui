export interface NavItem {
  label: string;
  href: string;
  exact?: boolean;
}

export const primaryNav: NavItem[] = [
  { label: "Tour trọn gói", href: "/tour-tron-goi" },
  { label: "Vé máy bay", href: "/ve-may-bay" },
  { label: "Khách sạn", href: "/khach-san" },
  { label: "Combo du lịch", href: "/combo-du-lich" },
  { label: "Dịch vụ cộng thêm", href: "/dich-vu-cong-them" },
];

export const primaryCta: NavItem = {
  label: "Lập chuyến đi",
  href: "/combo-du-lich",
};

export const guestAction: NavItem = {
  label: "Đăng nhập",
  href: "/dang-nhap",
};

export const accountNav: NavItem[] = [
  { label: "Hồ sơ", href: "/tai-khoan", exact: true },
  { label: "Địa điểm yêu thích", href: "/tai-khoan/yeu-thich" },
  { label: "Hành trình đã lưu", href: "/tai-khoan/hanh-trinh-da-luu" },
  { label: "Yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" },
  { label: "Bảo mật", href: "/tai-khoan/bao-mat" },
];

export const adminNav: NavItem[] = [
  { label: "Tổng quan", href: "/admin", exact: true },
  { label: "Địa danh", href: "/admin/diem-den" },
  { label: "Trải nghiệm", href: "/admin/trai-nghiem" },
  { label: "Hành trình", href: "/admin/hanh-trinh" },
  { label: "Chuyện bản địa", href: "/admin/chuyen-ban-dia" },
  { label: "Cẩm nang", href: "/admin/cam-nang" },
  { label: "Media", href: "/admin/media" },
  { label: "Yêu cầu tư vấn", href: "/admin/yeu-cau" },
  { label: "Người dùng", href: "/admin/nguoi-dung" },
  { label: "Audit log", href: "/admin/audit-log" },
];

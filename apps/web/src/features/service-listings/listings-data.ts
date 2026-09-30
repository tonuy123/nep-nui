// Dữ liệu danh sách dịch vụ cho các trang trong menu header.
// Giá, sao, mã, ngày khởi hành là số minh họa cho bản demo (theo yêu cầu), không phải giá bán thật.
// Ảnh dùng lại bộ ảnh đã có credit ở /nguon-anh.

export interface ListingCard {
  id: string;
  name: string;
  province: string;
  image: string;
  imageAlt?: string;
  imageCaption?: string;
  href?: string;
  sourceUrl?: string;
  description: string;
  stars?: number;
  priceFrom?: number;
  priceUnit: string;
  badge?: string;
  code?: string;
  duration?: string;
  departureFrom?: string;
  seats?: number;
  dates?: string[];
  promoNote?: string;
}

export interface PromoCard {
  id: string;
  name: string;
  image: string;
  imageAlt?: string;
  imageCaption?: string;
  href?: string;
  sourceUrl?: string;
  description?: string;
  province?: string;
  priceFrom?: number;
  priceOld?: number;
  discount?: number;
  unit: string;
  code?: string;
  duration?: string;
  departureFrom?: string;
  seats?: number;
}

export interface GuideContent {
  title: string;
  bookHeading: string;
  bookSteps: string[];
  standardHeading: string;
  standards: string[];
}

const d = (v: number) => v.toLocaleString("vi-VN");

export const formatPrice = (value: number) => `${d(value)}đ`;

// --- Khách sạn & lưu trú đã đối chiếu nguồn ---
export { hotelListings, hotelPromos } from "./hotel-data";


// --- Chuyến xe đường dài (cho trang Chuyến xe) ---
export const coachListings: ListingCard[] = [
  { id: "hn-sapa", name: "Hà Nội → Sa Pa", province: "Lào Cai", image: "/images/coaches/hn-sapa-coach.webp", imageAlt: "Xe khách liên tỉnh đỗ tại bến, tấm biển Hà Nội trước kính xe", imageCaption: "Ảnh minh họa — xe khách tại bến", description: "Nhà xe phổ biến trên tuyến: Sao Việt, Interbus Lines, Green Bus — giường nằm và cabin, khoảng 5–6 giờ.", priceFrom: 280000, priceUnit: "/ khách", badge: "Phổ biến", code: "CX-HN-SAPA", duration: "5 giờ", departureFrom: "Hà Nội", seats: 12, dates: ["07:00", "22:00"], href: "/diem-den/sa-pa" },
  { id: "hn-hagiang", name: "Hà Nội → Hà Giang", province: "Hà Giang", image: "/images/coaches/hn-hagiang-coach.webp", imageAlt: "Khoang giường nằm bên trong xe khách đường dài", imageCaption: "Ảnh minh họa — khoang giường nằm", description: "Nhà xe phổ biến trên tuyến: Bằng Phấn, Cầu Mè, Quang Nghị — giường nằm và limousine, khoảng 6–7 giờ.", priceFrom: 320000, priceUnit: "/ khách", code: "CX-HN-HG", duration: "7 giờ", departureFrom: "Hà Nội", seats: 9, dates: ["06:30", "21:00"], href: "/diem-den/meo-vac" },
  { id: "hn-mocchau", name: "Hà Nội → Mộc Châu", province: "Sơn La", image: "/images/coaches/hn-mocchau-coach.webp", imageAlt: "Lối đi giữa hai dãy giường nằm trong xe khách", imageCaption: "Ảnh minh họa — khoang giường nằm", description: "Nhà xe phổ biến trên tuyến: Mộc Châu Limousine, Hải Vân Xuân Tráng, Bắc Sơn — khoảng 4 giờ, có dừng nghỉ.", priceFrom: 200000, priceUnit: "/ khách", badge: "Tiết kiệm", code: "CX-HN-MC", duration: "4 giờ", departureFrom: "Hà Nội", seats: 14, dates: ["06:00", "09:00", "14:00", "20:00"], href: "/diem-den/moc-chau" },
  { id: "hn-maichau", name: "Hà Nội → Mai Châu", province: "Phú Thọ", image: "/images/coaches/hn-maichau-coach.webp", imageAlt: "Hông xe giường nằm với dãy cửa sổ và rèm che nắng", imageCaption: "Ảnh minh họa — xe khách đường dài", description: "Nhà xe phổ biến trên tuyến: Tùng Anh, Phương Hạ Mai Châu, Mai Châu Smile Limousine — khoảng 3 giờ từ Hà Nội.", priceFrom: 180000, priceUnit: "/ khách", code: "CX-HN-MAIC", duration: "3 giờ", departureFrom: "Hà Nội", seats: 10, dates: ["07:30", "13:30"], href: "/diem-den/mai-chau" },
  { id: "hn-taxua", name: "Hà Nội → Tà Xùa", province: "Sơn La", image: "/images/coaches/hn-taxua-coach.webp", imageAlt: "Xe giường nằm đỗ bên đường núi", imageCaption: "Ảnh minh họa — xe giường nằm", description: "Xe giường nằm tới Bắc Yên rồi trung chuyển lên Tà Xùa.", priceFrom: 350000, priceUnit: "/ khách", code: "CX-HN-TX", duration: "6 giờ", departureFrom: "Hà Nội", seats: 8, dates: ["20:30"], href: "/diem-den/ta-xua" },
  { id: "dienbien-hanoi", name: "Điện Biên → Hà Nội", province: "Điện Biên", image: "/images/coaches/dien-bien-coach.webp", imageAlt: "Khoang giường nằm sáng đèn bên trong xe chạy đêm", imageCaption: "Ảnh minh họa — khoang giường nằm ban đêm", description: "Xe giường nằm VIP, khoảng 12 giờ, nhận đón tại trung tâm thành phố.", priceFrom: 420000, priceUnit: "/ khách", code: "CX-DB-HN", duration: "12 giờ", departureFrom: "Điện Biên", seats: 6, dates: ["18:00"], href: "/diem-den/muong-thanh" },
];

// --- Dịch vụ cộng thêm ---
export const addOnListings: ListingCard[] = [
  { id: "transfer", name: "Xe nối chặng", province: "Tất cả", image: "/images/services/combo.webp", description: "Đón từ bến xe, ga tàu tới điểm bắt đầu chuyến đi.", priceFrom: 350000, priceUnit: "/ chuyến", badge: "Phổ biến", code: "DV-01", duration: "theo chặng" },
  { id: "guide", name: "Người dẫn đường địa phương", province: "Tất cả", image: "/images/destinations/bac-ha-card.webp", description: "Dẫn tuyến, thuyết minh văn hóa và hỗ trợ giao tiếp tại bản.", priceFrom: 500000, priceUnit: "/ ngày", code: "DV-02", duration: "theo ngày" },
  { id: "equipment", name: "Thiết bị cho chuyến đi", province: "Tất cả", image: "/images/destinations/moc-chau-card.webp", description: "Thuê lều, gậy trekking, áo mưa và đèn pin tại điểm đến.", priceFrom: 120000, priceUnit: "/ ngày", badge: "Tiết kiệm", code: "DV-03", duration: "theo ngày" },
  { id: "access", name: "Hỗ trợ tiếp cận", province: "Tất cả", image: "/images/destinations/muong-thanh-card.webp", description: "Sắp xếp phương tiện và lộ trình phù hợp điều kiện cá nhân.", priceFrom: 400000, priceUnit: "/ chuyến", code: "DV-04", duration: "theo chặng" },
];

// --- Ưu đãi theo trang ---


export const coachPromos: PromoCard[] = [
  { id: "p-hn-sapa", name: "Hà Nội → Sa Pa", image: "/images/coaches/hn-sapa-coach.webp", imageAlt: "Xe khách liên tỉnh đỗ tại bến", priceFrom: 196000, priceOld: 280000, discount: 30, unit: "/ khách", code: "CX-HN-SAPA", duration: "5 giờ", departureFrom: "Hà Nội", seats: 12, href: "/diem-den/sa-pa" },
  { id: "p-hn-hg", name: "Hà Nội → Hà Giang", image: "/images/coaches/hn-hagiang-coach.webp", imageAlt: "Khoang giường nằm trong xe khách đường dài", priceFrom: 224000, priceOld: 320000, discount: 30, unit: "/ khách", code: "CX-HN-HG", duration: "7 giờ", departureFrom: "Hà Nội", seats: 9, href: "/diem-den/meo-vac" },
  { id: "p-hn-mc", name: "Hà Nội → Mộc Châu", image: "/images/coaches/hn-mocchau-coach.webp", imageAlt: "Lối đi giữa hai dãy giường nằm trong xe khách", priceFrom: 140000, priceOld: 200000, discount: 30, unit: "/ khách", code: "CX-HN-MC", duration: "4 giờ", departureFrom: "Hà Nội", seats: 14, href: "/diem-den/moc-chau" },
  { id: "p-hn-tx", name: "Hà Nội → Tà Xùa", image: "/images/coaches/hn-taxua-coach.webp", imageAlt: "Xe giường nằm đỗ bên đường núi", priceFrom: 245000, priceOld: 350000, discount: 30, unit: "/ khách", code: "CX-HN-TX", duration: "6 giờ", departureFrom: "Hà Nội", seats: 8, href: "/diem-den/ta-xua" },
  { id: "p-hn-maic", name: "Hà Nội → Mai Châu", image: "/images/coaches/hn-maichau-coach.webp", imageAlt: "Hông xe giường nằm với dãy cửa sổ", priceFrom: 126000, priceOld: 180000, discount: 30, unit: "/ khách", code: "CX-HN-MAIC", duration: "3 giờ", departureFrom: "Hà Nội", seats: 10, href: "/diem-den/mai-chau" },
  { id: "p-db-hn", name: "Điện Biên → Hà Nội", image: "/images/coaches/dien-bien-coach.webp", imageAlt: "Khoang giường nằm sáng đèn bên trong xe chạy đêm", priceFrom: 294000, priceOld: 420000, discount: 30, unit: "/ khách", code: "CX-DB-HN", duration: "12 giờ", departureFrom: "Điện Biên", seats: 6, href: "/diem-den/muong-thanh" },
  { id: "p-hn-mcc", name: "Hà Nội → Mù Cang Chải", image: "/images/destinations/mu-cang-chai-card.webp", priceFrom: 266000, priceOld: 380000, discount: 30, unit: "/ khách", code: "CX-HN-MCC", duration: "6 giờ", departureFrom: "Hà Nội", seats: 8, href: "/diem-den/mu-cang-chai" },
  { id: "p-hn-bacha", name: "Hà Nội → Bắc Hà", image: "/images/destinations/bac-ha-card.webp", priceFrom: 259000, priceOld: 370000, discount: 30, unit: "/ khách", code: "CX-HN-BACHA", duration: "5 giờ", departureFrom: "Hà Nội", seats: 10, href: "/diem-den/bac-ha" },
];

export const addOnPromos: PromoCard[] = [
  { id: "p-transfer", name: "Xe nối chặng", image: "/images/services/combo.webp", priceFrom: 245000, priceOld: 350000, discount: 30, unit: "/ chuyến", code: "DV-01" },
  { id: "p-guide", name: "Người dẫn đường địa phương", image: "/images/destinations/bac-ha-card.webp", priceFrom: 350000, priceOld: 500000, discount: 30, unit: "/ ngày", code: "DV-02" },
  { id: "p-equip", name: "Thiết bị cho chuyến đi", image: "/images/destinations/moc-chau-card.webp", priceFrom: 84000, priceOld: 120000, discount: 30, unit: "/ ngày", code: "DV-03" },
  { id: "p-access", name: "Hỗ trợ tiếp cận", image: "/images/destinations/muong-thanh-card.webp", priceFrom: 280000, priceOld: 400000, discount: 30, unit: "/ chuyến", code: "DV-04" },
];

export const tourPromos: PromoCard[] = [
  { id: "p-tour-sapa", name: "Sa Pa 3 ngày 2 đêm", image: "/images/destinations/sa-pa-card.webp", priceFrom: 2490000, priceOld: 3550000, discount: 30, unit: "/ khách", code: "TB-SAPA-3N2D", duration: "3N2D", departureFrom: "Hà Nội", seats: 6, href: "/diem-den/sa-pa" },
  { id: "p-tour-hg", name: "Hà Giang mùa hoa", image: "/images/services/combo.webp", priceFrom: 3190000, priceOld: 4550000, discount: 30, unit: "/ khách", code: "TB-HG-4N3D", duration: "4N3D", departureFrom: "Hà Nội", seats: 8, href: "/diem-den/meo-vac" },
  { id: "p-tour-mc", name: "Mộc Châu trọn gói", image: "/images/destinations/moc-chau-card.webp", priceFrom: 1790000, priceOld: 2550000, discount: 30, unit: "/ khách", code: "TB-MC-2N1D", duration: "2N1D", departureFrom: "Hà Nội", seats: 10, href: "/diem-den/moc-chau" },
  { id: "p-tour-tx", name: "Tà Xùa săn mây", image: "/images/destinations/ta-xua-card.webp", priceFrom: 1990000, priceOld: 2840000, discount: 30, unit: "/ khách", code: "TB-TX-2N1D", duration: "2N1D", departureFrom: "Hà Nội", seats: 7, href: "/diem-den/ta-xua" },
  { id: "p-tour-mcc", name: "Mù Cang Chải mùa lúa", image: "/images/destinations/mu-cang-chai-card.webp", priceFrom: 2590000, priceOld: 3700000, discount: 30, unit: "/ khách", code: "TB-MCC-3N2D", duration: "3N2D", departureFrom: "Hà Nội", seats: 6, href: "/diem-den/mu-cang-chai" },
  { id: "p-tour-bh", name: "Bắc Hà mùa chợ phiên", image: "/images/destinations/bac-ha-card.webp", priceFrom: 2030000, priceOld: 2900000, discount: 30, unit: "/ khách", code: "TB-BH-3N2D", duration: "3N2D", departureFrom: "Hà Nội", seats: 8, href: "/diem-den/bac-ha" },
  { id: "p-tour-db", name: "Điện Biên — Mường Thanh", image: "/images/destinations/muong-thanh-card.webp", priceFrom: 3290000, priceOld: 4700000, discount: 30, unit: "/ khách", code: "TB-DB-4N3D", duration: "4N3D", departureFrom: "Hà Nội", seats: 6, href: "/diem-den/muong-thanh" },
  { id: "p-tour-lc", name: "Lai Châu mùa chè", image: "/images/provinces/lai-chau-card.webp", priceFrom: 2870000, priceOld: 4100000, discount: 30, unit: "/ khách", code: "TB-LC-3N2D", duration: "3N2D", departureFrom: "Hà Nội", seats: 8, href: "/diem-den/o-quy-ho" },
];

export const comboPromos: PromoCard[] = tourPromos;

export const guides: Record<"tour" | "coach" | "hotel" | "combo" | "addon", GuideContent> = {
  tour: {
    title: "Trước khi quyết định một chuyến đi",
    bookHeading: "Lịch đi cần rõ",
    bookSteps: [
      "Ngày khởi hành và điểm đón.",
      "Thời gian di chuyển từng chặng.",
      "Điểm dừng và nơi nghỉ mỗi đêm.",
      "Khoảng thời gian tự do.",
    ],
    standardHeading: "Chi phí và điều kiện cần hỏi",
    standards: [
      "Dịch vụ nào đã bao gồm, mục nào bạn tự trả.",
      "Phụ phí có thể phát sinh trong trường hợp nào.",
      "Điều kiện đổi ngày hoặc hủy chuyến.",
      "Đầu mối liên hệ khi lịch trình thay đổi.",
    ],
  },
  coach: {
    title: "Cách đặt chuyến xe và tiêu chuẩn dịch vụ",
    bookHeading: "Cách đặt chuyến xe",
    bookSteps: [
      "Chọn tuyến và giờ xuất phát phù hợp với lịch trình của bạn.",
      "Ghi rõ điểm đón, số người và hành lý khi xác nhận.",
      "Xác nhận lại giờ khởi hành 24 giờ trước khi đi.",
      "Có mặt trước giờ khởi hành 30 phút tại điểm hẹn.",
    ],
    standardHeading: "Tiêu chuẩn dịch vụ",
    standards: [
      "Xe đời mới, đúng loại ghế đã đăng ký (nằm hoặc ngồi).",
      "Tài xế có bằng lái phù hợp tuyến đường đèo.",
      "Dừng nghỉ hợp lý với tuyến trên 5 giờ.",
      "Hỗ trợ đổi giờ hoặc hoàn vé theo chính sách công bố.",
    ],
  },
  hotel: {
    title: "Những điều cần hỏi nơi lưu trú",
    bookHeading: "Cách đặt khách sạn",
    bookSteps: [
      "Chọn khu vực gần điểm bạn muốn khám phá nhất.",
      "Kiểm tra đường vào, giờ nhận phòng và chính sách hủy trước khi đặt.",
      "Đặt qua kênh chính thức của cơ sở lưu trú hoặc đối tác được ủy quyền.",
      "Lưu lại xác nhận đặt phòng và đầu mối liên hệ của nơi ở.",
    ],
    standardHeading: "Điều kiện phòng và chi phí",
    standards: [
      "Loại giường và số người tối đa trong phòng.",
      "Giờ nhận, trả phòng và phí khi đến sớm hoặc về muộn.",
      "Dịch vụ nào đã gồm trong giá, mục nào trả riêng.",
      "Số liên hệ khi cần hỗ trợ trong thời gian lưu trú.",
    ],
  },
  combo: {
    title: "Cách ghép combo và tiêu chuẩn dịch vụ",
    bookHeading: "Cách tạo và đặt combo",
    bookSteps: [
      "Chọn điểm đến và số ngày theo nhịp bạn muốn đi.",
      "Ghép kiểu lưu trú và trải nghiệm ưu tiên trong bản nháp.",
      "Gửi bản nháp để được kiểm tra tính hợp lý của lịch trình.",
      "Chốt danh sách dịch vụ rồi mới tiến hành đặt từng phần.",
    ],
    standardHeading: "Tiêu chuẩn dịch vụ",
    standards: [
      "Lịch trình không dồn chặng quá sức, có khoảng đệm di chuyển.",
      "Điểm dừng nghỉ và ăn uống được ghi rõ trong bản nháp.",
      "Các dịch vụ ghép đều từ nguồn đặt được kiểm tra trước.",
      "Có phương án thay thế khi thời tiết hoặc đường sá thay đổi.",
    ],
  },
  addon: {
    title: "Cách gửi yêu cầu và tiêu chuẩn dịch vụ",
    bookHeading: "Cách gửi yêu cầu dịch vụ",
    bookSteps: [
      "Chọn dịch vụ cần thêm: xe nối chặng, dẫn đường, thiết bị hoặc hỗ trợ.",
      "Ghi rõ địa điểm, thời gian và số người trong phần mô tả.",
      "Gửi yêu cầu tư vấn để được xác nhận khả năng đáp ứng.",
      "Chốt giá và thời gian trước khi tiến hành đặt dịch vụ.",
    ],
    standardHeading: "Tiêu chuẩn dịch vụ",
    standards: [
      "Nhân sự dịch vụ được xác minh danh tính và kinh nghiệm tuyến.",
      "Thiết bị cho thuê được kiểm tra và vệ sinh trước bàn giao.",
      "Giá dịch vụ báo trước, không phụ thu ngoài thỏa thuận.",
      "Đổi lịch trước 24 giờ không mất phí với dịch vụ linh hoạt.",
    ],
  },
};

export const promoHeading = "Ưu đãi giờ chốt";

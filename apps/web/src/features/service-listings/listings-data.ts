// Dữ liệu danh sách dịch vụ cho 5 trang trong menu header.
// Giá, sao, mã, ngày khởi hành là số minh họa cho bản demo (theo yêu cầu), không phải giá bán thật.
// Ảnh dùng lại bộ ảnh đã có credit ở /nguon-anh.

export interface ListingCard {
  id: string;
  name: string;
  province: string;
  image: string;
  description: string;
  stars?: number;
  priceFrom: number;
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
  priceFrom: number;
  priceOld: number;
  discount: number;
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

// --- Khách sạn & lưu trú ---
export const hotelListings: ListingCard[] = [
  { id: "sapa-charm", name: "Sapa Charm Hotel", province: "Lào Cai", image: "/images/services/hotel.webp", description: "Trung tâm Sa Pa, đi bộ ra quảng trường và nhà thờ đá.", stars: 4, priceFrom: 1023068, priceUnit: "/ đêm", badge: "Tiêu chuẩn", code: "KS-SAPA-01", seats: 6 },
  { id: "moc-chau-farm", name: "Farmstay Đồi Chè", province: "Sơn La", image: "/images/destinations/moc-chau-card.webp", description: "Nhà gỗ giữa đồi chè Mộc Châu, có bếp chung và vườn.", stars: 3, priceFrom: 650000, priceUnit: "/ đêm", code: "KS-MC-02", seats: 4 },
  { id: "ta-xua-cloud", name: "Săn mây Tà Xùa Homestay", province: "Sơn La", image: "/images/destinations/ta-xua-card.webp", description: "View sống lưng khủng long, phòng đôi và phòng tập thể.", stars: 3, priceFrom: 450000, priceUnit: "/ đêm", badge: "Tiết kiệm", code: "KS-TX-03", seats: 8 },
  { id: "mai-chau-stilt", name: "Nhà sàn Bản Lác", province: "Phú Thọ", image: "/images/destinations/mai-chau-card.webp", description: "Nhà sàn truyền thống người Thái, bữa tối cùng gia đình chủ nhà.", stars: 3, priceFrom: 520000, priceUnit: "/ đêm", code: "KS-MAIC-04", seats: 6 },
  { id: "muong-thanh-hotel", name: "Khách sạn Thung lũng", province: "Điện Biên", image: "/images/destinations/muong-thanh-card.webp", description: "Nhìn toàn cảnh cánh đồng Mường Thanh, thuận tiện thăm di tích.", stars: 4, priceFrom: 780000, priceUnit: "/ đêm", code: "KS-MT-05", seats: 5 },
  { id: "ha-giang-lodge", name: "Nhà nghỉ Cao Nguyên", province: "Hà Giang", image: "/images/services/addon.webp", description: "Điểm dừng chân trên cung đường Hà Giang, có bãi đỗ xe máy.", stars: 3, priceFrom: 380000, priceUnit: "/ đêm", code: "KS-HG-06", seats: 7 },
  { id: "mucangchai-guest", name: "Homestay Bản Mù Cang", province: "Lào Cai", image: "/images/destinations/mu-cang-chai-card.webp", description: "Sát ruộng bậc thang, mùa lúa chín mở cửa sổ là thấy vàng.", stars: 3, priceFrom: 420000, priceUnit: "/ đêm", badge: "Tiết kiệm", code: "KS-MCC-07", seats: 3 },
  { id: "bac-ha-house", name: "Nhà cổ Bắc Hà", province: "Lào Cai", image: "/images/destinations/bac-ha-card.webp", description: "Gần chợ phiên Bắc Hà, kiến trúc gỗ giữ nguyên nếp cũ.", stars: 4, priceFrom: 690000, priceUnit: "/ đêm", code: "KS-BH-08", seats: 4 },
];

// --- Chuyến xe đường dài (cho trang Vé máy bay) ---
export const coachListings: ListingCard[] = [
  { id: "hn-sapa", name: "Hà Nội → Sa Pa", province: "Lào Cai", image: "/images/destinations/sa-pa-card.webp", description: "Xe giường nằm, khởi hành 7:00 và 22:00, khoảng 5 giờ.", priceFrom: 280000, priceUnit: "/ khách", badge: "Phổ biến", code: "CX-HN-SAPA", duration: "5 giờ", departureFrom: "Hà Nội", seats: 12, dates: ["07:00", "22:00"] },
  { id: "hn-hagiang", name: "Hà Nội → Hà Giang", province: "Hà Giang", image: "/images/services/addon.webp", description: "Xe limousine 9 chỗ, trả khách tại trung tâm thành phố Hà Giang.", priceFrom: 320000, priceUnit: "/ khách", code: "CX-HN-HG", duration: "7 giờ", departureFrom: "Hà Nội", seats: 9, dates: ["06:30", "21:00"] },
  { id: "hn-mocchau", name: "Hà Nội → Mộc Châu", province: "Sơn La", image: "/images/destinations/moc-chau-card.webp", description: "Xe giường nằm, khoảng 4 giờ, dừng nghỉ giữa chặng.", priceFrom: 200000, priceUnit: "/ khách", badge: "Tiết kiệm", code: "CX-HN-MC", duration: "4 giờ", departureFrom: "Hà Nội", seats: 14, dates: ["06:00", "09:00", "14:00", "20:00"] },
  { id: "hn-maichau", name: "Hà Nội → Mai Châu", province: "Phú Thọ", image: "/images/destinations/mai-chau-card.webp", description: "Xe 16 chỗ, khoảng 3 giờ, đón tại bến Mỹ Đình.", priceFrom: 180000, priceUnit: "/ khách", code: "CX-HN-MAIC", duration: "3 giờ", departureFrom: "Hà Nội", seats: 10, dates: ["07:30", "13:30"] },
  { id: "hn-taxua", name: "Hà Nội → Tà Xùa", province: "Sơn La", image: "/images/destinations/ta-xua-card.webp", description: "Xe giường nằm tới Bắc Yên rồi trung chuyển lên Tà Xùa.", priceFrom: 350000, priceUnit: "/ khách", code: "CX-HN-TX", duration: "6 giờ", departureFrom: "Hà Nội", seats: 8, dates: ["20:30"] },
  { id: "dienbien-hanoi", name: "Điện Biên → Hà Nội", province: "Điện Biên", image: "/images/services/flight.webp", description: "Xe giường nằm VIP, khoảng 12 giờ, có cổng phụ tại sân bay.", priceFrom: 420000, priceUnit: "/ khách", code: "CX-DB-HN", duration: "12 giờ", departureFrom: "Điện Biên", seats: 6, dates: ["18:00"] },
];

// --- Dịch vụ cộng thêm ---
export const addOnListings: ListingCard[] = [
  { id: "transfer", name: "Xe nối chặng", province: "Tất cả", image: "/images/services/combo.webp", description: "Đón từ sân bay, ga tàu tới điểm bắt đầu chuyến đi.", priceFrom: 350000, priceUnit: "/ chuyến", badge: "Phổ biến", code: "DV-01", duration: "theo chặng" },
  { id: "guide", name: "Người dẫn đường địa phương", province: "Tất cả", image: "/images/destinations/bac-ha-card.webp", description: "Dẫn tuyến, thuyết minh văn hóa và hỗ trợ giao tiếp tại bản.", priceFrom: 500000, priceUnit: "/ ngày", code: "DV-02", duration: "theo ngày" },
  { id: "equipment", name: "Thiết bị cho chuyến đi", province: "Tất cả", image: "/images/destinations/moc-chau-card.webp", description: "Thuê lều, gậy trekking, áo mưa và đèn pin tại điểm đến.", priceFrom: 120000, priceUnit: "/ ngày", badge: "Tiết kiệm", code: "DV-03", duration: "theo ngày" },
  { id: "access", name: "Hỗ trợ tiếp cận", province: "Tất cả", image: "/images/destinations/muong-thanh-card.webp", description: "Sắp xếp phương tiện và lộ trình phù hợp điều kiện cá nhân.", priceFrom: 400000, priceUnit: "/ chuyến", code: "DV-04", duration: "theo chặng" },
];

// --- Ưu đãi theo trang ---
export const hotelPromos: PromoCard[] = [
  { id: "p-sapa", name: "Sapa Charm Hotel", image: "/images/services/hotel.webp", priceFrom: 715000, priceOld: 1023068, discount: 30, unit: "/ đêm", code: "KS-SAPA-01", seats: 6 },
  { id: "p-mocchau", name: "Farmstay Đồi Chè", image: "/images/destinations/moc-chau-card.webp", priceFrom: 455000, priceOld: 650000, discount: 30, unit: "/ đêm", code: "KS-MC-02", seats: 4 },
  { id: "p-bacha", name: "Nhà cổ Bắc Hà", image: "/images/destinations/bac-ha-card.webp", priceFrom: 483000, priceOld: 690000, discount: 30, unit: "/ đêm", code: "KS-BH-08", seats: 4 },
  { id: "p-muong", name: "Khách sạn Thung lũng", image: "/images/destinations/muong-thanh-card.webp", priceFrom: 546000, priceOld: 780000, discount: 30, unit: "/ đêm", code: "KS-MT-05", seats: 5 },
];

export const coachPromos: PromoCard[] = [
  { id: "p-hn-sapa", name: "Hà Nội → Sa Pa", image: "/images/destinations/sa-pa-card.webp", priceFrom: 196000, priceOld: 280000, discount: 30, unit: "/ khách", code: "CX-HN-SAPA", duration: "5 giờ", departureFrom: "Hà Nội", seats: 12 },
  { id: "p-hn-hg", name: "Hà Nội → Hà Giang", image: "/images/services/addon.webp", priceFrom: 224000, priceOld: 320000, discount: 30, unit: "/ khách", code: "CX-HN-HG", duration: "7 giờ", departureFrom: "Hà Nội", seats: 9 },
  { id: "p-hn-mc", name: "Hà Nội → Mộc Châu", image: "/images/destinations/moc-chau-card.webp", priceFrom: 140000, priceOld: 200000, discount: 30, unit: "/ khách", code: "CX-HN-MC", duration: "4 giờ", departureFrom: "Hà Nội", seats: 14 },
  { id: "p-hn-tx", name: "Hà Nội → Tà Xùa", image: "/images/destinations/ta-xua-card.webp", priceFrom: 245000, priceOld: 350000, discount: 30, unit: "/ khách", code: "CX-HN-TX", duration: "6 giờ", departureFrom: "Hà Nội", seats: 8 },
];

export const addOnPromos: PromoCard[] = [
  { id: "p-transfer", name: "Xe nối chặng", image: "/images/services/combo.webp", priceFrom: 245000, priceOld: 350000, discount: 30, unit: "/ chuyến", code: "DV-01" },
  { id: "p-guide", name: "Người dẫn đường địa phương", image: "/images/destinations/bac-ha-card.webp", priceFrom: 350000, priceOld: 500000, discount: 30, unit: "/ ngày", code: "DV-02" },
  { id: "p-equip", name: "Thiết bị cho chuyến đi", image: "/images/destinations/moc-chau-card.webp", priceFrom: 84000, priceOld: 120000, discount: 30, unit: "/ ngày", code: "DV-03" },
  { id: "p-access", name: "Hỗ trợ tiếp cận", image: "/images/destinations/muong-thanh-card.webp", priceFrom: 280000, priceOld: 400000, discount: 30, unit: "/ chuyến", code: "DV-04" },
];

export const tourPromos: PromoCard[] = [
  { id: "p-tour-sapa", name: "Sa Pa 3 ngày 2 đêm", image: "/images/destinations/sa-pa-card.webp", priceFrom: 2490000, priceOld: 3550000, discount: 30, unit: "/ khách", code: "TB-SAPA-3N2D", duration: "3N2D", departureFrom: "Hà Nội", seats: 6 },
  { id: "p-tour-hg", name: "Hà Giang mùa hoa", image: "/images/services/addon.webp", priceFrom: 3190000, priceOld: 4550000, discount: 30, unit: "/ khách", code: "TB-HG-4N3D", duration: "4N3D", departureFrom: "Hà Nội", seats: 8 },
  { id: "p-tour-mc", name: "Mộc Châu trọn gói", image: "/images/destinations/moc-chau-card.webp", priceFrom: 1790000, priceOld: 2550000, discount: 30, unit: "/ khách", code: "TB-MC-2N1D", duration: "2N1D", departureFrom: "Hà Nội", seats: 10 },
  { id: "p-tour-tx", name: "Tà Xùa săn mây", image: "/images/destinations/ta-xua-card.webp", priceFrom: 1990000, priceOld: 2840000, discount: 30, unit: "/ khách", code: "TB-TX-2N1D", duration: "2N1D", departureFrom: "Hà Nội", seats: 7 },
];

export const comboPromos: PromoCard[] = tourPromos;

export const guides: Record<"tour" | "flight" | "hotel" | "combo" | "addon", GuideContent> = {
  tour: {
    title: "Cách đặt tour và tiêu chuẩn dịch vụ",
    bookHeading: "Cách đặt tour",
    bookSteps: [
      "Chọn điểm đến theo cảnh quan hoặc mùa bạn muốn đi.",
      "Gửi yêu cầu tư vấn để chốt lịch trình, số ngày và mức ngân sách.",
      "Xác nhận danh sách dịch vụ trong lịch trình trước khi đặt cọc.",
      "Nhận lịch trình chi tiết và đầu mối liên hệ trước ngày khởi hành.",
    ],
    standardHeading: "Tiêu chuẩn dịch vụ",
    standards: [
      "Lịch trình công bố rõ từng ngày, không phát sinh mục ngoài thỏa thuận.",
      "Hướng dẫn viên nói tiếng Việt, am hiểu tuyến và điểm đến.",
      "Xe đưa đón đúng số chỗ, có bảo hiểm chuyến đi.",
      "Điểm lưu trú được xác nhận trước và có phương án thay thế tương đương.",
    ],
  },
  flight: {
    title: "Cách đặt chuyến xe và tiêu chuẩn dịch vụ",
    bookHeading: "Cách đặt chuyến xe",
    bookSteps: [
      "Chọn tuyến và giờ xuất phát phù hợp với chuyến bay của bạn.",
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
    title: "Cách đặt khách sạn và tiêu chuẩn dịch vụ",
    bookHeading: "Cách đặt khách sạn",
    bookSteps: [
      "Chọn khu vực gần điểm bạn muốn khám phá nhất.",
      "Kiểm tra đường vào, giờ nhận phòng và chính sách hủy trước khi đặt.",
      "Đặt qua kênh chính thức của cơ sở lưu trú hoặc đối tác được ủy quyền.",
      "Lưu lại xác nhận đặt phòng và đầu mối liên hệ của nơi ở.",
    ],
    standardHeading: "Tiêu chuẩn dịch vụ",
    standards: [
      "Ảnh và mô tả phòng sát thực tế, có thông tin rõ về loại phòng.",
      "Vệ sinh phòng và khu vực chung theo từng ngày lưu trú.",
      "Có người trực 24/7 hoặc số liên hệ khẩn cấp.",
      "Hóa đơn và phụ phí công khai, không thu thêm ngoài báo giá.",
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
export const promoSubtext = "Khám phá Tây Bắc với mức giá ưu đãi khi đặt trong khung giờ này.";
export const listingPriceNote = "Giá minh họa cho bản demo, chưa phải giá bán chính thức.";

// Ba slide gioi thieu tren trang chu — thay cho video gioi thieu.
// Anh dung lai bo anh da co credit tai /nguon-anh.

export interface ShowcaseSlide {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  cta: { label: string; href: string };
  panel: string;
}

export const showcaseSlides: ShowcaseSlide[] = [
  {
    id: "diem-den",
    image: "/images/destinations/mu-cang-chai-article.webp",
    alt: "Ruộng bậc thang Mù Cang Chải uốn theo sườn núi",
    eyebrow: "Điểm đến Tây Bắc",
    title: "Vùng đất",
    titleAccent: "ít người biết",
    description:
      "Ruộng bậc thang, sống núi và những buổi sáng mây phủ. Mười điểm đến có bài viết cùng nguồn tham khảo rõ ràng để bạn chọn nơi bắt đầu.",
    cta: { label: "Xem 10 điểm đến", href: "/kham-pha" },
    panel: "bg-forest-deep",
  },
  {
    id: "chuyen-xe",
    image: "/images/services/coach.webp",
    alt: "Cung đường đèo nối Hà Nội với các tỉnh Tây Bắc",
    eyebrow: "Chuyến xe đường dài",
    title: "Đi Tây Bắc",
    titleAccent: "không khó",
    description:
      "Xe giường nằm và limousine nối Hà Nội với các tỉnh Tây Bắc. Giờ chạy, điểm đón trả và số chỗ còn trống đều rõ ràng trước khi bạn đặt.",
    cta: { label: "Xem chuyến xe", href: "/ve-may-bay" },
    panel: "bg-forest",
  },
  {
    id: "combo",
    image: "/images/services/combo.webp",
    alt: "Đường đèo quanh co tại đèo Mã Pí Lèng, Hà Giang",
    eyebrow: "Combo du lịch",
    title: "Chuyến đi",
    titleAccent: "của riêng bạn",
    description:
      "Ghép điểm đến, thời lượng và lưu trú thành bản nháp chuyến đi trong vài phút. Ưu đãi giờ chốt áp dụng khi bạn chốt qua Nếp Núi.",
    cta: { label: "Lập chuyến đi", href: "/combo-du-lich" },
    panel: "bg-earth",
  },
];

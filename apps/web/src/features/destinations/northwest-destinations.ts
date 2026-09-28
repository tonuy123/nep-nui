export interface DestinationPhoto {
  src: string;
  alt: string;
  author: string;
  sourceUrl: string;
  sourceLabel?: string;
  license: string;
  licenseUrl: string;
}

export type DestinationTheme =
  | "Ruộng bậc thang"
  | "Núi & mây"
  | "Bản làng"
  | "Thung lũng"
  | "Cao nguyên";

export interface NorthwestDestination {
  slug: string;
  name: string;
  province: string;
  landscape: string;
  theme: DestinationTheme;
  teaser: string;
  introduction: string;
  highlights: readonly string[];
  travelNote: string;
  sourceUrl: string;
  photo?: DestinationPhoto;
  illustration?: "village" | "river";
}

export interface DestinationPreview {
  slug: string;
  name: string;
  province: string;
  landscape: string;
  theme: DestinationTheme;
  teaser: string;
  photo?: Pick<DestinationPhoto, "src" | "alt">;
  illustration?: NorthwestDestination["illustration"];
}

// Editorial discovery data for the contest. It is separate from the public CMS API
// until the publish workflow can supply curated, rights-cleared destinations.
export const northwestDestinations: readonly NorthwestDestination[] = [
  {
    slug: "sa-pa",
    name: "Sa Pa",
    province: "Lào Cai",
    landscape: "Thung lũng & ruộng bậc thang",
    theme: "Ruộng bậc thang",
    teaser: "Men theo Mường Hoa, nhìn những thửa ruộng nối tới chân Hoàng Liên Sơn.",
    introduction:
      "Sa Pa mở ra từ thung lũng Mường Hoa: đường mòn, ruộng bậc thang và những bản làng nằm dưới dãy Hoàng Liên Sơn. Đi chậm một ngày sẽ thấy cảnh quan thay đổi theo ánh sáng và nhịp sinh hoạt ở thung lũng.",
    highlights: [
      "Đi bộ ở Mường Hoa để nhìn ruộng bậc thang từ gần, thay vì chỉ dừng ở điểm ngắm cảnh.",
      "Tìm hiểu đời sống bản địa qua một trải nghiệm do người địa phương tổ chức.",
      "Nếu lên Fansipan, kiểm tra thời tiết và điều kiện vận hành trong ngày.",
    ],
    travelNote:
      "Đường núi và thời tiết có thể đổi nhanh. Chọn lộ trình vừa sức, hỏi trước khi chụp người dân và tôn trọng không gian sống ở bản.",
    sourceUrl: "https://www.vietnam.travel/vi/places-to-go/northern-vietnam/sapa",
    photo: {
      src: "/images/destinations/sa-pa.jpg",
      alt: "Ruộng bậc thang và dãy núi ở Sa Pa",
      author: "Eerin25",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Rice_terraces_in_Sapa,_Vietnam.jpg",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  },
  {
    slug: "mu-cang-chai",
    name: "Mù Cang Chải",
    province: "Lào Cai",
    landscape: "Ruộng bậc thang",
    theme: "Ruộng bậc thang",
    teaser: "Những đường cong trên sườn núi đổi sắc từ mùa nước đổ tới mùa lúa chín.",
    introduction:
      "Ở Mù Cang Chải, ruộng bậc thang không chỉ là một góc chụp. Chúng chạy theo độ dốc của núi, thay màu khi nước về, khi mạ lên và khi lúa chín. Mỗi điểm dừng trên đường có một góc nhìn khác vào cảnh quan do nhiều thế hệ canh tác tạo nên.",
    highlights: [
      "Nhìn toàn cảnh những thửa ruộng ở khu vực Chế Cu Nha hoặc La Pán Tẩn.",
      "Tìm hiểu cách người dân làm ruộng trên sườn dốc qua hướng dẫn địa phương.",
      "Dành thời gian cho cung đường; không dừng xe ở vị trí che tầm nhìn trên đèo.",
    ],
    travelNote:
      "Mùa đẹp thay đổi theo lịch canh tác từng năm. Xác nhận tình trạng đường và thời tiết trước khi đi, nhất là vào mùa mưa.",
    sourceUrl: "https://www.vietnam.travel/vi/things-to-do/mu-cang-chai-spectacle-water-pouring-season",
    photo: {
      src: "/images/destinations/mu-cang-chai.jpg",
      alt: "Ruộng bậc thang ở Chế Cu Nha, Mù Cang Chải",
      author: "Doan Tuan",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Terraces_in_Che_Cu_Nha_commune,_Mu_Cang_Chai_(Unsplash).jpg",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  },
  {
    slug: "ta-xua",
    name: "Tà Xùa",
    province: "Sơn La",
    landscape: "Sống núi & biển mây",
    theme: "Núi & mây",
    teaser: "Sớm trên sống núi, mây và nắng mở ra từng lớp cảnh quan khác nhau.",
    introduction:
      "Tà Xùa hợp với người thích một buổi sáng thật sớm: sườn núi nối tiếp, sương đi qua bản và ánh nắng đổi màu theo giờ. Biển mây là một khả năng thú vị của thời tiết, không phải điều chuyến đi nào cũng gặp.",
    highlights: [
      "Chọn điểm ngắm bình minh phù hợp khả năng di chuyển của cả nhóm.",
      "Dành khoảng lặng để nhìn cảnh quan thay đổi thay vì chạy qua nhiều điểm chụp.",
      "Nếu đi bộ đường núi, tìm hiểu độ khó và đi cùng người có kinh nghiệm.",
    ],
    travelNote:
      "Không quảng bá việc bước ra mép sống núi để chụp ảnh. Luôn xem dự báo và nghe hướng dẫn an toàn tại chỗ.",
    sourceUrl: "https://vietnam.travel/vi/things-to-do/ta-xua-staircase-thousand-clouds",
    photo: {
      src: "/images/destinations/ta-xua.png",
      alt: "Bản vùng núi Tà Xùa trong nắng sớm và sương",
      author: "NKSTTSSHNVN",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:T%C3%A0_X%C3%B9a_in_morning_mist.png",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  {
    slug: "moc-chau",
    name: "Mộc Châu",
    province: "Sơn La",
    landscape: "Cao nguyên & đồi chè",
    theme: "Cao nguyên",
    teaser: "Đồi chè lượn theo cao nguyên, mở ra một nhịp khám phá nhẹ nhàng.",
    introduction:
      "Mộc Châu có những luống chè uốn lượn trên nền đồi rộng. Không gian thoáng và các điểm thiên nhiên lân cận tạo một hành trình chậm, phù hợp người muốn dành thời gian cho cảnh quan hơn là chạy lịch trình dày.",
    highlights: [
      "Đi bộ ở đồi chè trên lối được phép, tránh giẫm vào luống cây.",
      "Tìm một cơ sở địa phương để hiểu thêm việc trồng và chế biến chè.",
      "Giữ lịch trình thoáng để có thời gian dừng ở những góc nhìn trên cao nguyên.",
    ],
    travelNote:
      "Đồi chè là nơi sản xuất. Hỏi trước khi vào vườn hoặc chụp ảnh tại cơ sở của người dân.",
    sourceUrl: "https://www.vietnam.travel/things-to-do/moc-chau-green-and-peaceful-summer-oasis-near-hanoi",
    photo: {
      src: "/images/destinations/moc-chau.jpg",
      alt: "Hai người thu hoạch chè trên sườn đồi Mộc Châu",
      author: "Long (lTiga) Nguyen",
      sourceUrl: "https://unsplash.com/photos/two-people-harvesting-tea-on-a-hillside-GDp6L255rXY",
      sourceLabel: "Unsplash",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
    },
  },
  {
    slug: "y-ty",
    name: "Y Tý",
    province: "Lào Cai",
    landscape: "Vùng cao biên giới",
    theme: "Núi & mây",
    teaser: "Ruộng bậc thang, rừng và những buổi sáng mây lấp đầy thung lũng.",
    introduction:
      "Y Tý nằm cao ở vùng biên giới Lào Cai. Những thửa ruộng len theo núi, còn mây có thể phủ cả thung lũng vào một buổi sớm. Đây cũng là không gian sinh sống của cộng đồng Hà Nhì, đáng để tìm hiểu với sự tôn trọng.",
    highlights: [
      "Ngắm ruộng bậc thang từ các điểm dừng an toàn dọc hành trình.",
      "Tìm hiểu kiến trúc và sinh hoạt bản làng qua người hướng dẫn địa phương.",
      "Dành thời gian dự phòng vì thời tiết vùng cao thay đổi nhanh.",
    ],
    travelNote:
      "Đây là khu vực biên giới. Kiểm tra quy định đi lại hiện hành, thời tiết và điều kiện đường trước chuyến đi.",
    sourceUrl: "https://vietnam.travel/node/1251",
    photo: {
      src: "/images/destinations/y-ty.jpg",
      alt: "Ruộng lúa và núi mây quanh bản Y Tý",
      author: "Peter Hammer",
      sourceUrl: "https://unsplash.com/photos/scenery-of-rice-fields-ggQy5lGtwb0",
      sourceLabel: "Unsplash",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
    },
  },
  {
    slug: "bac-ha",
    name: "Bắc Hà",
    province: "Lào Cai",
    landscape: "Chợ phiên & văn hóa",
    theme: "Bản làng",
    teaser: "Một buổi chợ vùng cao rộn màu vải, sản vật và nhịp gặp gỡ.",
    introduction:
      "Chợ phiên Bắc Hà là nơi người dân gặp nhau, trao đổi hàng hóa và giữ một nhịp sinh hoạt riêng của vùng cao. Đi qua các quầy hàng, du khách có thể thấy trang phục, nghề thủ công và nông sản địa phương; đó là đời sống thật, không phải sân khấu phục vụ khách.",
    highlights: [
      "Dành buổi sáng để quan sát chợ khi hoạt động còn nhộn nhịp.",
      "Ưu tiên mua hàng trực tiếp từ người làm hoặc người bán địa phương.",
      "Xin phép trước khi chụp chân dung, đặc biệt với trẻ em.",
    ],
    travelNote:
      "Giờ và hình thức họp chợ có thể thay đổi. Xác nhận thông tin gần ngày đi và giữ lối đi thông thoáng cho người bán.",
    sourceUrl: "https://image.vietnam.travel/things-to-do/sapa-itinerary-sustainable-travellers",
    photo: {
      src: "/images/destinations/bac-ha.jpg",
      alt: "Người dân trao đổi hàng hóa tại chợ Bắc Hà",
      author: "Peter Olshevsky",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Bac_Ha_market_day,_Vietnam.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  {
    slug: "ngoc-chien",
    name: "Ngọc Chiến",
    province: "Sơn La",
    landscape: "Bản làng & suối khoáng",
    theme: "Bản làng",
    teaser: "Nghe tiếng guồng nước, nghỉ ở bản và tìm một nhịp chậm bên suối khoáng.",
    introduction:
      "Ngọc Chiến được biết đến với suối khoáng nóng, những guồng nước và hình thức du lịch cộng đồng. Cảnh quan có sức hút, nhưng điều đáng dành thời gian hơn là câu chuyện về bữa ăn, công việc và nghề truyền thống của người chủ nhà.",
    highlights: [
      "Chọn dịch vụ do cộng đồng địa phương trực tiếp vận hành khi có thể.",
      "Tìm hiểu cách sử dụng suối khoáng và quy định tại điểm đến trước khi xuống nước.",
      "Để người chủ nhà dẫn câu chuyện về bản, thay vì áp sẵn một lịch chụp ảnh.",
    ],
    travelNote:
      "Xác nhận giờ mở cửa và quy định sử dụng tại điểm suối khoáng. Ưu tiên dịch vụ do người địa phương vận hành với thông tin rõ ràng.",
    sourceUrl: "https://vietnam.travel/vi/things-to-do/community-based-tourism-vietnam",
    illustration: "river",
  },
  {
    slug: "mai-chau",
    name: "Mai Châu",
    province: "Phú Thọ",
    landscape: "Thung lũng & nhà sàn",
    theme: "Thung lũng",
    teaser: "Đạp xe qua cánh đồng và ở lại để hiểu thêm nhịp sống trong bản.",
    introduction:
      "Mai Châu là một thung lũng có những cánh đồng, bản làng và nhà sàn. Một chuyến đi thong thả bằng xe đạp cho phép nhìn cảnh quan gần hơn, rồi ở lại để tìm hiểu bữa ăn, nghề dệt và nếp sinh hoạt của người Thái Trắng.",
    highlights: [
      "Đi xe đạp trên cung đường phù hợp và nhường đường cho sinh hoạt của người dân.",
      "Chọn nhà nghỉ cộng đồng có thông tin rõ ràng về người vận hành và dịch vụ.",
      "Tìm hiểu nghề dệt, món ăn qua lời giới thiệu của người làm ra chúng.",
    ],
    travelNote:
      "Tên tỉnh hiển thị theo địa giới sau sắp xếp năm 2025; nhiều tài liệu và ảnh cũ vẫn ghi Hòa Bình.",
    sourceUrl: "https://vietnam.travel/vi/places-to-go/northern-vietnam/mai-chau",
    photo: {
      src: "/images/destinations/mai-chau.jpg",
      alt: "Thung lũng Mai Châu nhìn từ trên cao",
      author: "Shyamal",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mai_Chau_2.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  {
    slug: "sin-suoi-ho",
    name: "Sin Suối Hồ",
    province: "Lai Châu",
    landscape: "Du lịch cộng đồng",
    theme: "Bản làng",
    teaser: "Một bản người Mông giữa núi, nơi vườn địa lan và nghề thủ công có câu chuyện riêng.",
    introduction:
      "Sin Suối Hồ là điểm du lịch cộng đồng của Lai Châu. Vườn địa lan, những ngôi nhà trong bản và cách người dân đón khách tạo nên trải nghiệm ở nhịp chậm. Giá trị của chuyến đi nằm ở cuộc gặp với người địa phương, không chỉ ở một tấm ảnh phong cảnh.",
    highlights: [
      "Tìm hiểu vườn địa lan và sản phẩm địa phương qua người trồng, người làm.",
      "Hỏi rõ dịch vụ cộng đồng trước khi đặt lịch lưu trú hoặc hướng dẫn.",
      "Giữ gìn vệ sinh bản và tôn trọng không gian riêng của gia đình chủ nhà.",
    ],
    travelNote:
      "Hỏi trước về điều kiện lưu trú, người hướng dẫn và hoạt động phù hợp; tôn trọng quy định của bản trong suốt chuyến đi.",
    sourceUrl: "https://dulich.laichau.gov.vn/vi/blog/details/ban-du-lich-cong-dong-sin-suoi-ho-116",
    illustration: "village",
  },
  {
    slug: "muong-thanh",
    name: "Thung lũng Mường Thanh",
    province: "Điện Biên",
    landscape: "Cánh đồng & lịch sử",
    theme: "Thung lũng",
    teaser: "Một lòng chảo rộng, nơi cảnh quan gặp câu chuyện văn hóa và lịch sử Điện Biên.",
    introduction:
      "Cánh đồng Mường Thanh trải trong lòng chảo Điện Biên. Từ cảnh quan canh tác, hành trình có thể mở sang các bản làng người Thái và những địa điểm gắn với lịch sử vùng đất. Mỗi lớp câu chuyện giúp nơi này rộng hơn một điểm ngắm cảnh.",
    highlights: [
      "Quan sát cánh đồng ở vị trí được phép, tránh đi vào ruộng đang canh tác.",
      "Tìm hiểu văn hóa bản địa qua người dẫn chuyện hoặc không gian cộng đồng.",
      "Dành thời gian cho di tích lịch sử nếu muốn hiểu bối cảnh của Điện Biên.",
    ],
    travelNote:
      "Ảnh ghi lại một góc thung lũng; cảnh đồng ruộng và thời tiết thay đổi theo mùa.",
    sourceUrl: "https://muongthanh.dienbien.gov.vn/TIN_TUC/View/?PageIndex=9&UserKey=Xay-dung-diem-den-van-hoa---du-lich-Muong-Thanh",
    photo: {
      src: "/images/destinations/muong-thanh.jpg",
      alt: "Núi và ánh nắng trên thung lũng Mường Thanh",
      author: "Tycho",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:M%C6%B0%E1%BB%9Dng_Thanh_Valley.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  },
];

export function findNorthwestDestination(slug: string) {
  return northwestDestinations.find((destination) => destination.slug === slug);
}

export const northwestDestinationPreviews: readonly DestinationPreview[] =
  northwestDestinations.map(({ slug, name, province, landscape, theme, teaser, photo, illustration }) => ({
    slug,
    name,
    province,
    landscape,
    theme,
    teaser,
    photo: photo ? { src: photo.src, alt: photo.alt } : undefined,
    illustration,
  }));

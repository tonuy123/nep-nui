export interface DestinationPhoto {
  // Keep the original for provenance; serve pre-sized derivatives to browsers.
  src: string;
  cardSrc: string;
  articleSrc: string;
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
  photo?: Pick<DestinationPhoto, "cardSrc" | "alt">;
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
      cardSrc: "/images/destinations/sa-pa-card.webp",
      articleSrc: "/images/destinations/sa-pa-article.webp",
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
      cardSrc: "/images/destinations/mu-cang-chai-card.webp",
      articleSrc: "/images/destinations/mu-cang-chai-article.webp",
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
      cardSrc: "/images/destinations/ta-xua-card.webp",
      articleSrc: "/images/destinations/ta-xua-article.webp",
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
      cardSrc: "/images/destinations/moc-chau-card.webp",
      articleSrc: "/images/destinations/moc-chau-article.webp",
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
      cardSrc: "/images/destinations/y-ty-card.webp",
      articleSrc: "/images/destinations/y-ty-article.webp",
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
      cardSrc: "/images/destinations/bac-ha-card.webp",
      articleSrc: "/images/destinations/bac-ha-article.webp",
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
      cardSrc: "/images/destinations/mai-chau-card.webp",
      articleSrc: "/images/destinations/mai-chau-article.webp",
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
      cardSrc: "/images/destinations/muong-thanh-card.webp",
      articleSrc: "/images/destinations/muong-thanh-article.webp",
      alt: "Núi và ánh nắng trên thung lũng Mường Thanh",
      author: "Tycho",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:M%C6%B0%E1%BB%9Dng_Thanh_Valley.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  },
  {
    slug: "dong-van",
    name: "Đồng Văn",
    province: "Hà Giang",
    landscape: "Cao nguyên đá",
    theme: "Cao nguyên",
    teaser: "Cao nguyên đá, phố cổ nhỏ và những cung đường nối các bản người Mông.",
    introduction:
      "Đồng Văn nằm trong vùng cao nguyên đá của Hà Giang, nơi đá xám phủ gần như toàn bộ sườn núi. Phố cổ ít nhà nhưng đủ cho một buổi tối đi bộ, còn ban ngày đường lại mở về các bản với chợ phiên và những vườn lanh trước hiên nhà.",
    highlights: [
      "Đi bộ buổi tối quanh phố cổ và tìm hiểu tuổi của những ngôi nhà hai tầng mái ngói.",
      "Ghé chợ phiên khu vực nếu đúng ngày, xem người dân bán nông sản và đồ thủ công.",
      "Giữ tốc độ chậm trên các cung đường đá; đây là địa hình dốc và dễ trơn khi mưa.",
    ],
    travelNote:
      "Cao nguyên đá khô và lạnh hơn các vùng lân cận về đêm. Lịch chợ theo phiên từng xã; xác nhận ngày trước khi sắp hành trình.",
    sourceUrl: "https://vi.wikipedia.org/wiki/%C4%90%E1%BB%93ng_V%C4%83n",
    illustration: "village",
  },
  {
    slug: "meo-vac",
    name: "Mèo Vạc",
    province: "Hà Giang",
    landscape: "Đèo núi & hẻm vực",
    theme: "Núi & mây",
    teaser: "Thị trấn nhỏ dưới chân Mã Pí Lèng, nơi hẻm vực sông Nho Quế mở ra.",
    introduction:
      "Mèo Vạc là điểm dừng cuối của cung đường từ Đồng Văn xuống, với hẻm vực sông Nho Quế nằm ngay bên. Đứng trên đèo Mã Pí Lèng nhìn xuống, con sông xanh cắt giữa hai vách đá là hình ảnh khó gặp ở nơi khác. Du thuyền trên hẻm vực cần đặt trước theo mùa nước.",
    highlights: [
      "Ngắm hẻm vực sông Nho Quế từ các điểm dừng được phép trên đèo Mã Pí Lèng.",
      "Hỏi trước về mùa nước và lịch thuyền nếu muốn đi trong hẻm vực.",
      "Dành thời gian ở thị trấn vào buổi sáng, khi chợ nhỏ họp ở đầu phố.",
    ],
    travelNote:
      "Đèo Mã Pí Lèng nhiều khúc cua gắt, hạn chế dừng xe ở lòng đường. Mùa nước đẹp nhất thường khác nhau theo năm; xác nhận với đơn vị tổ chức.",
    sourceUrl: "https://vi.wikipedia.org/wiki/M%C3%A8o_V%E1%BA%A1c",
    photo: {
      src: "/images/destinations/meo-vac-article.webp",
      cardSrc: "/images/destinations/meo-vac-card.webp",
      articleSrc: "/images/destinations/meo-vac-article.webp",
      alt: "Đèo Mã Pí Lèng nhìn từ trên cao",
      author: "hoaln",
      sourceLabel: "Flickr",
      sourceUrl: "https://www.flickr.com/photos/61859341@N06/6361013773",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
  {
    slug: "hoang-su-phi",
    name: "Hoàng Su Phì",
    province: "Hà Giang",
    landscape: "Ruộng bậc thang",
    theme: "Ruộng bậc thang",
    teaser: "Những thửa ruộng xếp tầng ở sườn đông, ít đông hơn các cung đường chính.",
    introduction:
      "Hoàng Su Phì nằm ở phía đông Hà Giang, nơi ruộng bậc thang trải trên nhiều xã và ít khách hơn so với các điểm phía tây. Đường vào còn gập ghềnh, nhưng bù lại là nhịp bản làng còn nguyên vẹn: người dân đi nương, lúa phơi trước nhà, và mùa gặt tháng chín làm cả sườn đồi đổi màu.",
    highlights: [
      "Đi theo các xã Bản Phùng, Bản Luốc vào mùa lúa chín để thấy ruộng đổi màu theo sườn.",
      "Nghỉ lại một đêm ở bản để đi bộ buổi sáng sớm, khi sương còn chưa tan hết.",
      "Đặt trước chỗ ở mùa gặt; khu vực này có ít nhà nghỉ hơn các huyện khác.",
    ],
    travelNote:
      "Đường vào các xã có đoạn hẹp và dốc, cần chạy chậm và tránh đi đêm. Mùa lúa thay đổi theo từng xã; hỏi người địa phương trước khi chốt lịch.",
    sourceUrl: "https://vi.wikipedia.org/wiki/Ho%C3%A0ng_Su_Ph%C3%AC",
    photo: {
      src: "/images/destinations/hoang-su-phi-article.webp",
      cardSrc: "/images/destinations/hoang-su-phi-card.webp",
      articleSrc: "/images/destinations/hoang-su-phi-article.webp",
      alt: "Phiên chợ vùng cao ở Hoàng Su Phì",
      author: "bmr-mam",
      sourceLabel: "Flickr",
      sourceUrl: "https://www.flickr.com/photos/122094967@N08/13663097065",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    },
  },
  {
    slug: "quan-ba",
    name: "Quản Bạ",
    province: "Hà Giang",
    landscape: "Cổng trời & núi đôi",
    theme: "Núi & mây",
    teaser: "Cổng trời mở xuống thị trấn Tam Sơn, với núi đôi đứng giữa thung lũng.",
    introduction:
      "Quản Bạ là cửa ngõ đầu tiên của cao nguyên đá khi đi từ Hà Giang lên. Từ cổng trời, thị trấn Tam Sơn hiện ra dưới thung lũng, còn núi đôi là điểm dừng quen thuộc trên đường. Địa hình ở đây mở và thoáng hơn các huyện phía bắc, phù hợp cho chặng nghỉ đầu tiên.",
    highlights: [
      "Dừng ở cổng trời Quản Bạ vào sáng sớm để nhìn thung lũng Tam Sơn trong sương.",
      "Ghé núi đôi ở khu vực gần thị trấn, giữ khoảng cách với ruộng đang canh tác.",
      "Ghép Quản Bạ vào ngày đầu của cung đường Hà Giang trước khi lên Yên Minh.",
    ],
    travelNote:
      "Cổng trời là điểm dừng ngắn; hạn chế dừng lâu vì lối vào đông xe và bụi. Thời tiết thung lũng đổi nhanh vào buổi chiều.",
    sourceUrl: "https://vi.wikipedia.org/wiki/Qu%E1%BA%A3n_B%E1%BA%A1",
    photo: {
      src: "/images/destinations/quan-ba-article.webp",
      cardSrc: "/images/destinations/quan-ba-card.webp",
      articleSrc: "/images/destinations/quan-ba-article.webp",
      alt: "Núi đá và thung lũng Quản Bạ",
      author: "nv_tan",
      sourceLabel: "Flickr",
      sourceUrl: "https://www.flickr.com/photos/14644229@N08/24491597094",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
  {
    slug: "sin-ho",
    name: "Sìn Hồ",
    province: "Lai Châu",
    landscape: "Thị trấn trong sương",
    theme: "Núi & mây",
    teaser: "Một thị trấn nhỏ nằm cao trên núi, sáng sớm thường chìm trong sương.",
    introduction:
      "Sìn Hồ nằm ở độ cao hơn 1.500 mét, đường lên uốn theo sườn núi và ruộng bậc thang. Thị trấn nhỏ, ít dịch vụ nhưng có không khí núi thật: sáng sớm sương phủ, trưa tan dần để lộ các dãy núi xếp lớp. Chợ huyện họp sớm là điểm bắt đầu tốt cho một ngày đi bộ.",
    highlights: [
      "Đi chợ sáng của thị trấn, nơi người các xã mang nông sản và đồ thổ cẩm xuống bán.",
      "Chạy xe theo đường vào một số xã để nhìn ruộng bậc thang hai bên sườn núi.",
      "Hỏi trước về chỗ nghỉ; thị trấn có ít nhà nghỉ hơn các huyện du lịch khác.",
    ],
    travelNote:
      "Đường lên Sìn Hồ dài và nhiều đoạn quanh co; không nên đi đêm. Nhiệt độ ban đêm thấp quanh năm, kể cả mùa hè.",
    sourceUrl: "https://vi.wikipedia.org/wiki/S%C3%ACn_H%E1%BB%93",
    illustration: "village",
  },
  {
    slug: "o-quy-ho",
    name: "Đèo Ô Quy Hồ",
    province: "Lai Châu",
    landscape: "Đèo & hoàng hôn",
    theme: "Núi & mây",
    teaser: "Con đèo nối Sa Pa với Lai Châu, hoàng hôn buông xuống các tầng núi.",
    introduction:
      "Đèo Ô Quy Hồ nối Lào Cai và Lai Châu, với những khúc cua bám theo sườn núi và tầm nhìn mở xuống thung lũng. Đây là một trong những con đèo dài của vùng, phù hợp chạy xe ban ngày. Chiều muộn, mặt trời lặn sau các tầng núi là thời điểm nhiều người dừng lại.",
    highlights: [
      "Chạy trọn đèo vào buổi chiều để bắt hoàng hôn ở phía Lai Châu.",
      "Dừng xe ở các điểm mở được phép; tránh dừng ở khúc cua khuất tầm nhìn.",
      "Kiểm tra thời tiết trước khi đi, đèo có thể mù đặc và ẩm ướt vào cuối ngày.",
    ],
    travelNote:
      "Đèo có nhiều đoạn sương mù dày vào cuối ngày; bật đèn và chạy chậm. Không nên đi lần đầu vào buổi tối.",
    sourceUrl: "https://vi.wikipedia.org/wiki/%C4%90%C3%A8o_%C3%94_Quy_H%E1%BB%93",
    photo: {
      src: "/images/destinations/o-quy-ho-article.webp",
      cardSrc: "/images/destinations/o-quy-ho-card.webp",
      articleSrc: "/images/destinations/o-quy-ho-article.webp",
      alt: "Cung đường núi ở Sa Pa hướng về Ô Quy Hồ",
      author: "Shutteract",
      sourceLabel: "Flickr",
      sourceUrl: "https://www.flickr.com/photos/189550735@N08/50170377462",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
  {
    slug: "muong-ang",
    name: "Mường Ảng",
    province: "Điện Biên",
    landscape: "Thung lũng & đồi",
    theme: "Thung lũng",
    teaser: "Thung lũng rộng giữa các dãy núi, ít khách và còn nhiều góc nhìn mở.",
    introduction:
      "Mường Ảng nằm giữa các dãy núi của Điện Biên, với cánh đồng lúa trải dọc theo trục đường chính. Đây không phải điểm đến có nhiều dịch vụ, nhưng cảnh quan và nhịp sống bù lại: buổi sáng, cả thung lũng làm việc trên đồng, chiều muộn mặt trời lặn sau núi phía tây.",
    highlights: [
      "Chạy xe theo trục đường chính vào sáng sớm để nhìn cánh đồng trong nắng đầu ngày.",
      "Ghép Mường Ảng vào hành trình Điện Biên như một chặng nghỉ ít khách.",
      "Mua nông sản theo mùa tại chợ huyện thay vì tìm quà đóng gói sẵn.",
    ],
    travelNote:
      "Dịch vụ lưu trú và ăn uống còn ít; nên chủ động kế hoạch nghỉ và nhiên liệu. Đồng ruộng đổi màu theo vụ.",
    sourceUrl: "https://vi.wikipedia.org/wiki/M%C6%B0%E1%BB%9Dng_%E1%BA%A2ng",
    illustration: "river",
  },
  {
    slug: "muong-lay",
    name: "Mường Lay",
    province: "Điện Biên",
    landscape: "Ngã ba sông",
    theme: "Thung lũng",
    teaser: "Thị xã nhỏ nằm giữa hai dòng sông, cửa vào vùng hồ thủy điện Mường Lay.",
    introduction:
      "Mường Lay nằm ở ngã ba sông Đà và sông Nậm Lay, phần lớn thị xã được quy hoạch lại sau khi thủy điện dâng nước. Cảnh quan mặt nước rộng và các dãy núi hai bên tạo cảm giác yên tĩnh, khác với những thị trấn vùng cao nhiều dốc. Đây là điểm nghỉ hợp lý trên trục đường Điện Biên – Lai Châu.",
    highlights: [
      "Đi bộ dọc kè sông vào buổi tối, nhìn hai dòng sông gặp nhau.",
      "Hỏi người địa phương về đời sống thị xã sau khi hồ chứa dâng nước.",
      "Chọn Mường Lay làm điểm nghỉ đêm khi chạy trục Điện Biên – Lai Châu.",
    ],
    travelNote:
      "Đây là thị xã nhỏ, dịch vụ vừa phải; xác nhận giờ ăn của quán trước khi đến muộn.",
    sourceUrl: "https://vi.wikipedia.org/wiki/M%C6%B0%E1%BB%9Dng_Lay",
    photo: {
      src: "/images/destinations/muong-lay-article.webp",
      cardSrc: "/images/destinations/muong-lay-card.webp",
      articleSrc: "/images/destinations/muong-lay-article.webp",
      alt: "Thị xã Mường Lay bên dòng sông Đà",
      author: "Arian Zwegers",
      sourceLabel: "Flickr",
      sourceUrl: "https://www.flickr.com/photos/67769030@N07/6223799972",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
  {
    slug: "bat-xat",
    name: "Bát Xát",
    province: "Lào Cai",
    landscape: "Thung lũng biên giới",
    theme: "Bản làng",
    teaser: "Huyện biên giới phía bắc Lào Cai, cửa ngõ lên Y Tý và các bản người Hà Nhì.",
    introduction:
      "Bát Xát kéo dài từ đồng bằng ven sông Hồng lên tận vùng biên giới trên 2.000 mét. Các xã như Phìn Ngan, Mường Hum giữ nhịp bản làng với ruộng, ngô và nhà trình tường. Đây là điểm xuất phát để lên Y Tý, nhưng bản thân các xã dọc đường cũng đáng dừng lại.",
    highlights: [
      "Dừng ở các xã dọc đường như Phìn Ngan để đi bộ ngắn qua khu dân cư.",
      "Tìm hiểu nhà trình tường và đời sống người Hà Nhì qua người địa phương.",
      "Kiểm tra giấy tờ cá nhân khi dự định lên các xã sát biên giới.",
    ],
    travelNote:
      "Một số xã nằm trong khu vực biên giới; mang theo giấy tờ tùy thân. Đường lên các xã cao có thể sạt lở vào mùa mưa.",
    sourceUrl: "https://vi.wikipedia.org/wiki/B%C3%A1t_X%C3%A1t",
    photo: {
      src: "/images/destinations/bat-xat-article.webp",
      cardSrc: "/images/destinations/bat-xat-card.webp",
      articleSrc: "/images/destinations/bat-xat-article.webp",
      alt: "Em bé người Hà Nhì ở Bát Xát",
      author: "hoaln",
      sourceLabel: "Flickr",
      sourceUrl: "https://www.flickr.com/photos/61859341@N06/6574855673",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
  {
    slug: "bac-yen",
    name: "Bắc Yên",
    province: "Sơn La",
    landscape: "Núi & mây",
    theme: "Núi & mây",
    teaser: "Cửa ngõ lên Tà Xùa, với những bản nằm rải trên sườn núi phía tây.",
    introduction:
      "Bắc Yên nằm dưới chân dãy núi dẫn lên Tà Xùa. Thị trấn có chợ và đường nối sang nhiều xã vùng cao, còn phía trên là các bản nằm rải rác giữa sườn núi. Nhiều người qua Bắc Yên trên đường săn mây, nhưng thung lũng và các bản dưới thấp cũng có buổi chiều dễ chịu.",
    highlights: [
      "Ghép một buổi chiều ở thị trấn để đi bộ chợ và ăn tối cùng người địa phương.",
      "Đi theo các xã vùng cao nếu muốn ở lại qua đêm giữa các bản thay vì chỉ lên săn mây.",
      "Xác nhận tình trạng đường lên các xã trước khi đi, tùy theo mùa.",
    ],
    travelNote:
      "Các bản vùng cao có ít dịch vụ; hỏi trước về chỗ nghỉ và bữa ăn. Nên đổ xăng đầy trước khi đi vào các xã xa.",
    sourceUrl: "https://vi.wikipedia.org/wiki/B%E1%BA%AFc_Y%C3%AAn",
    illustration: "river",
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
    photo: photo ? { cardSrc: photo.cardSrc, alt: photo.alt } : undefined,
    illustration,
  }));

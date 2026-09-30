// Ảnh khoảnh khắc trải nghiệm cho gallery trang chủ (nguồn Wikimedia Commons).
// Credit đầy đủ tại /nguon-anh.

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "mua-nuoc-do-khau-pha",
    src: "/images/gallery/mu-cang-chai-khau-pha.webp",
    alt: "Ruộng bậc thang Khau Phạ mùa nước đổ với những đường cong trên sườn đồi",
    caption: "Mùa nước đổ, Khau Phạ",
    author: "VŨ HÙNG",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:KHAU_PH%E1%BA%A0_M%C3%99A_N%C6%AF%E1%BB%9AC_%C4%90%E1%BB%94_-_panoramio.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    id: "ban-phung",
    src: "/images/gallery/hoang-su-phi-ban-phung.webp",
    alt: "Ruộng bậc thang Bản Phùng uốn theo sườn núi ở Hoàng Su Phì",
    caption: "Ruộng bậc thang Bản Phùng",
    author: "NKSTTSSHNVN",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ru%E1%BB%99ng_b%E1%BA%ADc_thang_B%E1%BA%A3n_Ph%C3%B9ng_1_-_NKS.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "doi-che-moc-chau",
    src: "/images/gallery/moc-chau-doi-che.webp",
    alt: "Những luống chè xanh nối nhau trên đồi ở Mộc Châu",
    caption: "Đồi chè Mộc Châu",
    author: "ToanNguyen",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Moc-chau-tea-doi-2094890_960_720.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "ma-pi-leng-pano",
    src: "/images/gallery/ma-pi-leng-panorama.webp",
    alt: "Toàn cảnh đèo Mã Pí Lèng nhìn từ trên cao xuống dòng sông Nho Quế",
    caption: "Toàn cảnh Mã Pí Lèng",
    author: "Velvet",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ma_Pi_Leng_pano_ter.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "thung-lung-sin-ho",
    src: "/images/gallery/thung-lung-sin-ho.webp",
    alt: "Thung lũng Nậm Ban mù sương với con đường đèo uốn quanh và dòng sông dưới chân núi ở Sìn Hồ, Lai Châu",
    caption: "Thung lũng Nậm Ban, Sìn Hồ",
    author: "Tiên Ông",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:N%E1%BA%ADm_Ban,_S%C3%ACn_H%E1%BB%93,_Lai_Ch%C3%A2u,_Vietnam_-_panoramio_(2).jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    id: "cao-nguyen-da-dong-van",
    src: "/images/gallery/dong-van-cao-nguyen-da.webp",
    alt: "Cao nguyên đá Đồng Văn với những dãy núi đá xám trùng điệp",
    caption: "Cao nguyên đá Đồng Văn",
    author: "NKSTTSSHNVN",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cao_nguy%C3%AAn_%C4%91%C3%A1_%C4%90%E1%BB%93ng_V%C4%83n_-_NKS.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "bien-may-ta-xua",
    src: "/images/gallery/ta-xua-bien-may.webp",
    alt: "Biển mây phủ trắng sống núi Tà Xùa nhìn từ trên cao",
    caption: "Sống núi Tà Xùa trong biển mây",
    author: "HaiLit",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:On_cloud_in_Ta_Xua.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "sapa-fansipan",
    src: "/images/gallery/sapa-thung-lung-fansipan.webp",
    alt: "Toàn cảnh bản làng, ruộng bậc thang và thị trấn Sa Pa dưới chân Fansipan",
    caption: "Bản làng dưới chân Fansipan",
    author: "Kandukuru Nagarjun",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Farming_village,_Fansipan.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
];

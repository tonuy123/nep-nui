// Ảnh khoảnh khắc trải nghiệm cho gallery trang chủ (nguồn Flickr qua Openverse).
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
    id: "trekking-sapa",
    src: "/images/gallery/trekking-sapa.webp",
    alt: "Nhóm bạn trekking xuống thung lũng ở Sa Pa",
    caption: "Trekking thung lũng Sa Pa",
    author: "astrangelyisolatedplace",
    sourceUrl: "https://www.flickr.com/photos/8500/8321273490",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "cho-bac-ha",
    src: "/images/gallery/cho-bac-ha.webp",
    alt: "Thiếu nữ H'Mông trong trang phục truyền thống tại chợ Bắc Hà",
    caption: "Thiếu nữ H'Mông, chợ Bắc Hà",
    author: "Arian Zwegers",
    sourceUrl: "https://www.flickr.com/photos/67769030@N07/6224063124",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "cho-can-cau",
    src: "/images/gallery/cho-can-cau.webp",
    alt: "Người H'Mông tại chợ Cán Cẩu, Si Ma Cai",
    caption: "Chợ Cán Cẩu, Si Ma Cai",
    author: "Arian Zwegers",
    sourceUrl: "https://www.flickr.com/photos/67769030@N07/6223427427",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "ruong-sapa",
    src: "/images/gallery/ruong-sapa.webp",
    alt: "Ruộng bậc thang ở Sa Pa nhìn từ trên cao",
    caption: "Ruộng bậc thang Sa Pa",
    author: "Christopher Crouzet",
    sourceUrl: "https://www.flickr.com/photos/25338288@N05/23082778974",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "cung-duong-ha-giang",
    src: "/images/gallery/cung-duong-ha-giang.webp",
    alt: "Cung đường vòng quanh núi ở Hà Giang",
    caption: "Cung đường Hà Giang",
    author: "miketnorton",
    sourceUrl: "https://www.flickr.com/photos/49665685@N06/39567166870",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "thung-lung-sapa",
    src: "/images/gallery/thung-lung-sapa.webp",
    alt: "Toàn cảnh thung lũng Sa Pa phủ sương",
    caption: "Thung lũng Sa Pa",
    author: "whimsyscript",
    sourceUrl: "https://www.flickr.com/photos/143580985@N08/27680050750",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "bac-thang-sapa",
    src: "/images/gallery/terraced-sapa.jpg",
    alt: "Những thửa ruộng bậc thang xanh mướt uốn theo sườn đồi dưới nắng vàng ở Sa Pa",
    caption: "Bậc thang dưới nắng, Sa Pa",
    author: "Konstantin Krismer",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Terraced_fields_Sa_Pa_Vietnam.JPG",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
  },
  {
    id: "cho-vung-cao-ha-giang",
    src: "/images/gallery/cho-ha-giang.jpg",
    alt: "Khu chợ vùng cao với mái tôn và bạt xanh chìm trong sương mù ở Hà Giang",
    caption: "Chợ vùng cao trong sương, Hà Giang",
    author: "Vuong Tri Binh",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hmong_market_tents_in_rural_Ha_Giang_province,_2014.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
];

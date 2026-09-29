export interface ProvincePhoto {
  src: string;
  alt: string;
  author: string;
  sourceUrl: string;
  sourceLabel?: string;
  license: string;
  licenseUrl: string;
}

export interface WeatherProvince {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  photo: ProvincePhoto;
}

export interface ProvinceWeather {
  temperature: number;
  humidity: number;
  wind: number;
  code: number;
  min: number;
  max: number;
  rain: number;
}

export interface ProvinceWeatherItem {
  province: WeatherProvince;
  weather: ProvinceWeather;
}

export const weatherProvinces: readonly WeatherProvince[] = [
  {
    slug: "lai-chau",
    name: "Lai Châu",
    latitude: 22.396,
    longitude: 103.458,
    photo: {
      src: "/images/provinces/lai-chau-card.webp",
      alt: "Hoàng hôn trên đèo Ô Quy Hồ",
      author: "Dansapa",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sunset_on_O_Quy_Ho_pass.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    },
  },
  {
    slug: "lao-cai",
    name: "Lào Cai",
    latitude: 22.485,
    longitude: 103.97,
    photo: {
      src: "/images/destinations/sa-pa-card.webp",
      alt: "Ruộng bậc thang và dãy núi ở Sa Pa",
      author: "Eerin25",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Rice_terraces_in_Sapa,_Vietnam.jpg",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  },
  {
    slug: "ha-giang",
    name: "Hà Giang",
    latitude: 22.823,
    longitude: 104.984,
    photo: {
      src: "/images/provinces/ha-giang-card.webp",
      alt: "Vách núi và cung đường đèo Mã Pí Lèng",
      author: "Hoach Le Dinh",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:M%C3%A3_P%C3%AD_L%C3%A8ng_Pass,_Vietnam.jpg",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  },
  {
    slug: "dien-bien",
    name: "Điện Biên",
    latitude: 21.386,
    longitude: 103.023,
    photo: {
      src: "/images/destinations/muong-thanh-card.webp",
      alt: "Núi và ánh nắng trên thung lũng Mường Thanh",
      author: "Tycho",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:M%C6%B0%E1%BB%9Dng_Thanh_Valley.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    },
  },
  {
    slug: "son-la",
    name: "Sơn La",
    latitude: 21.327,
    longitude: 103.914,
    photo: {
      src: "/images/destinations/ta-xua-card.webp",
      alt: "Bản vùng núi Tà Xùa trong nắng sớm và sương",
      author: "NKSTTSSHNVN",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:T%C3%A0_X%C3%B9a_in_morning_mist.png",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    },
  },
  {
    slug: "yen-bai",
    name: "Yên Bái",
    latitude: 21.722,
    longitude: 104.911,
    photo: {
      src: "/images/provinces/yen-bai-card.webp",
      alt: "Đèo Khau Phạ nhìn xuống ruộng bậc thang Mù Cang Chải",
      author: "Viethavvh",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Khau_Ph%E1%BA%A1.jpg",
      license: "Public domain",
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    },
  },
  {
    slug: "phu-tho",
    name: "Phú Thọ",
    latitude: 21.422,
    longitude: 105.211,
    photo: {
      src: "/images/provinces/phu-tho-card.webp",
      alt: "Đồi chè xanh ở Phú Thọ",
      author: "Bùi Thụy Đào Nguyên",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:%C4%90%E1%BB%93i_ch%C3%A8_%E1%BB%9F_Ph%C3%BA_Th%E1%BB%8D.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    },
  },
  {
    slug: "hoa-binh",
    name: "Hòa Bình",
    latitude: 20.813,
    longitude: 105.338,
    photo: {
      src: "/images/provinces/hoa-binh-card.webp",
      alt: "Thung lũng Mai Châu với những nếp nhà giữa ruộng lúa",
      author: "Franzfoto",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mai_Chau_-_H%C3%A4user_im_Reisfeld.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    },
  },
];

export const weatherPanelPhoto: ProvincePhoto = {
  src: "/images/provinces/panel-hoang-lien-son.webp",
  alt: "Dãy Hoàng Liên Sơn trong nắng",
  author: "Christophe95",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Ho%C3%A0ng_Li%C3%AAn_S%C6%A1n_mountains_10.jpg",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
};

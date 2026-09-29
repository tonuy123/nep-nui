// Meta tour minh họa cho 20 điểm đến (hiển thị trên card trang chủ và trang Tour).
// Mã, ngày, giá, số chỗ là số demo, không phải lịch khởi hành thật.

export interface DestinationTourMeta {
  code: string;
  duration: string;
  priceFrom: number;
  dates: string[];
  seats: number;
  departureFrom: string;
}

const D_A = ["01/10", "08/10", "15/10", "22/10", "29/10"];
const D_B = ["05/10", "12/10", "19/10", "26/10"];
const D_C = ["10/10", "20/10", "30/10"];

export const destinationTourMeta: Record<string, DestinationTourMeta> = {
  "sa-pa": { code: "TB-SAPA-3N2D", duration: "3N2D", priceFrom: 2490000, dates: D_A, seats: 6, departureFrom: "Hà Nội" },
  "mu-cang-chai": { code: "TB-MCC-3N2D", duration: "3N2D", priceFrom: 2690000, dates: D_B, seats: 8, departureFrom: "Hà Nội" },
  "ta-xua": { code: "TB-TX-2N1D", duration: "2N1D", priceFrom: 1990000, dates: D_C, seats: 7, departureFrom: "Hà Nội" },
  "moc-chau": { code: "TB-MC-2N1D", duration: "2N1D", priceFrom: 1790000, dates: D_A, seats: 10, departureFrom: "Hà Nội" },
  "y-ty": { code: "TB-YTY-4N3D", duration: "4N3D", priceFrom: 3890000, dates: D_B, seats: 5, departureFrom: "Hà Nội" },
  "bac-ha": { code: "TB-BH-3N2D", duration: "3N2D", priceFrom: 2590000, dates: D_A, seats: 8, departureFrom: "Hà Nội" },
  "ngoc-chien": { code: "TB-NC-2N1D", duration: "2N1D", priceFrom: 1890000, dates: D_C, seats: 6, departureFrom: "Hà Nội" },
  "mai-chau": { code: "TB-MAIC-2N1D", duration: "2N1D", priceFrom: 1690000, dates: D_B, seats: 10, departureFrom: "Hà Nội" },
  "sin-suoi-ho": { code: "TB-SSH-3N2D", duration: "3N2D", priceFrom: 2790000, dates: D_A, seats: 5, departureFrom: "Hà Nội" },
  "muong-thanh": { code: "TB-MT-3N2D", duration: "3N2D", priceFrom: 2890000, dates: D_B, seats: 7, departureFrom: "Hà Nội" },
  "dong-van": { code: "TB-DV-4N3D", duration: "4N3D", priceFrom: 3590000, dates: D_C, seats: 6, departureFrom: "Hà Nội" },
  "meo-vac": { code: "TB-MV-4N3D", duration: "4N3D", priceFrom: 3690000, dates: D_A, seats: 8, departureFrom: "Hà Nội" },
  "hoang-su-phi": { code: "TB-HSP-3N2D", duration: "3N2D", priceFrom: 2990000, dates: D_B, seats: 6, departureFrom: "Hà Nội" },
  "quan-ba": { code: "TB-QB-3N2D", duration: "3N2D", priceFrom: 2890000, dates: D_A, seats: 9, departureFrom: "Hà Nội" },
  "sin-ho": { code: "TB-SH-4N3D", duration: "4N3D", priceFrom: 3990000, dates: D_C, seats: 5, departureFrom: "Hà Nội" },
  "o-quy-ho": { code: "TB-OQH-3N2D", duration: "3N2D", priceFrom: 3190000, dates: D_A, seats: 7, departureFrom: "Hà Nội" },
  "muong-ang": { code: "TB-MA-3N2D", duration: "3N2D", priceFrom: 2750000, dates: D_B, seats: 8, departureFrom: "Hà Nội" },
  "muong-lay": { code: "TB-ML-3N2D", duration: "3N2D", priceFrom: 2650000, dates: D_C, seats: 6, departureFrom: "Hà Nội" },
  "bat-xat": { code: "TB-BX-3N2D", duration: "3N2D", priceFrom: 3100000, dates: D_A, seats: 5, departureFrom: "Hà Nội" },
  "bac-yen": { code: "TB-BY-2N1D", duration: "2N1D", priceFrom: 2050000, dates: D_B, seats: 9, departureFrom: "Hà Nội" },
};

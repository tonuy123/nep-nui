// Noi dung gioi thieu ngan cho 5 trang dich vu.
// Van phong quang ba noi bo, khong dung so lieu dia phuong hay gia cu the ngoai du lieu demo da co.

export type ServiceKey = "tour" | "coach" | "hotel" | "combo" | "addon";

export interface BenefitBlock {
  heading: string;
  intro: string;
  items: string[];
}

export interface BenefitsContent {
  sectionEyebrow?: string;
  sectionTitle?: string;
  why: BenefitBlock;
  experience: BenefitBlock;
  perks: BenefitBlock;
}

export const serviceBenefits: Record<ServiceKey, BenefitsContent> = {
  tour: {
    sectionEyebrow: "Chọn tour Tây Bắc",
    sectionTitle: "Chọn chuyến đi vừa với bạn",
    why: {
      heading: "Chọn nơi muốn đến",
      intro: "Ruộng bậc thang Mù Cang Chải, núi trong sương Tà Xùa hay đồi chè Mộc Châu — chọn cảnh quan bạn muốn tìm hiểu trước khi tính lịch đi.",
      items: [
        "Lọc điểm đến theo cảnh quan bạn thích.",
        "Mở bài địa điểm để xem ảnh và thông tin có nguồn.",
        "So sánh những nơi phù hợp với số ngày bạn có.",
      ],
    },
    experience: {
      heading: "Xem nhịp chuyến đi",
      intro: "Một ảnh đẹp chưa nói hết chuyến đi. Hãy tính cả thời gian di chuyển và thời gian thật sự ở lại.",
      items: [
        "Điểm khởi hành và số ngày dự kiến có hợp lịch của bạn?",
        "Chặng nào đi xe lâu, dừng nghỉ ở đâu?",
        "Mỗi ngày còn bao nhiêu thời gian tự do?",
      ],
    },
    perks: {
      heading: "Chuẩn bị yêu cầu tư vấn",
      intro: "Chọn xong điểm đến, ghi lại số ngày và điều bạn ưu tiên để trao đổi về một lịch trình cụ thể.",
      items: [
        "Ghi số người và khoảng thời gian có thể đi.",
        "Nêu kiểu lưu trú và trải nghiệm bạn muốn ưu tiên.",
        "Gửi yêu cầu để trao đổi về lịch trình và dịch vụ.",
      ],
    },
  },
  coach: {
    why: {
      heading: "Vì sao nên đi Tây Bắc",
      intro: "Chặng Hà Nội — Tây Bắc dài từ 3 đến 12 tiếng, chọn đúng cách di chuyển là một nửa chuyến đi.",
      items: [
        "Cung đường qua đèo và thung lũng thay đổi liên tục — ngồi xe ngắm cảnh cũng là một phần trải nghiệm.",
        "Nhiều tuyến chạy đêm giúp tiết kiệm trọn một ngày hành trình.",
        "Các điểm đến lớn như Sa Pa, Hà Giang, Mộc Châu đều có tuyến thẳng từ Hà Nội.",
        "Xe giường nằm hoặc limousine phù hợp cả nhóm bạn lẫn gia đình.",
      ],
    },
    experience: {
      heading: "Trải nghiệm khi đặt xe qua Nếp Núi",
      intro: "Chọn tuyến theo lịch của bạn, phần còn lại để Nếp Núi xác nhận.",
      items: [
        "Xem giờ chạy, thời gian di chuyển và số chỗ còn trống trước khi đặt.",
        "Thông tin điểm đón, điểm trả được xác nhận rõ ràng khi chốt.",
        "Cần nối chặng cuối? Đặt luôn dịch vụ xe nối chặng trong cùng một yêu cầu.",
        "Đổi lịch linh hoạt theo chính sách của từng nhà xe.",
      ],
    },
    perks: {
      heading: "Ưu đãi khi đặt xe qua Nếp Núi",
      intro: "Vé đặt qua Nếp Núi minh bạch từ giá tới chính sách đổi trả.",
      items: [
        "Giá vé hiển thị rõ, ưu đãi giờ chốt áp dụng cho các tuyến trong danh sách.",
        "Không phí đặt chỗ — thanh toán một lần, xác nhận trước giờ chạy.",
        "Hỗ trợ đổi tuyến hoặc hoàn tiền theo chính sách nhà xe.",
        "Một đầu mối liên hệ duy nhất khi có thay đổi giờ chạy.",
      ],
    },
  },
  hotel: {
    sectionEyebrow: "Lưu trú",
    sectionTitle: "Chọn chỗ nghỉ trước khi lên đường",
    why: {
      heading: "Chọn khu vực",
      intro: "Đối chiếu nơi nghỉ với những điểm bạn muốn ghé.",
      items: [
        "Xem vị trí cơ sở trên bản đồ.",
        "Kiểm tra khoảng cách tới điểm bắt đầu hành trình.",
        "Hỏi về đường vào và nơi đỗ xe nếu tự lái.",
        "Chọn loại phòng theo số người trong nhóm.",
      ],
    },
    experience: {
      heading: "Xem thông tin cơ sở",
      intro: "Mỗi card dẫn tới website hoặc nguồn du lịch của nơi ở.",
      items: [
        "Mở nguồn để xem ảnh phòng và thông tin liên hệ.",
        "Đọc chú thích để phân biệt ảnh cơ sở với ảnh khu vực.",
        "Hỏi trực tiếp về yêu cầu ăn uống hoặc tiếp cận.",
        "Lưu đầu mối liên hệ trước ngày đến.",
      ],
    },
    perks: {
      heading: "Kiểm tra trước khi đặt",
      intro: "Giá và phòng trống cần xác nhận trực tiếp với cơ sở.",
      items: [
        "Xác nhận giá cho đúng ngày và số khách.",
        "Hỏi chi phí đã gồm bữa sáng, thuế và phụ phí chưa.",
        "Đọc điều kiện đổi ngày, hủy phòng và hoàn tiền.",
        "Giữ xác nhận đặt phòng cùng nội dung đã thỏa thuận.",
      ],
    },
  },
  combo: {
    why: {
      heading: "Vì sao nên đi Tây Bắc",
      intro: "Combo phù hợp khi bạn biết mình muốn gì nhưng chưa muốn ràng buộc lịch.",
      items: [
        "Ghép điểm đến, thời lượng và lưu trú theo nhu cầu thật của bạn.",
        "Bản nháp giúp trao đổi với tư vấn nhanh hơn, ít qua lại hơn.",
        "Linh hoạt đổi phương án khi thời tiết hoặc lịch trình thay đổi.",
        "Phù hợp cả nhóm nhỏ lẫn gia đình đông người.",
      ],
    },
    experience: {
      heading: "Trải nghiệm khi lập combo qua Nếp Núi",
      intro: "Từ ý tưởng tới bản nháp chỉ trong vài bước.",
      items: [
        "Chọn điểm đến từ danh sách đã kiểm tra thông tin.",
        "Điều chỉnh số ngày và mức ưu tiên bằng một cú nhấp.",
        "Sao chép bản nháp để gửi yêu cầu tư vấn ngay trong trang.",
        "Nhận phương án chi tiết kèm xác nhận từ đối tác trước khi chốt.",
      ],
    },
    perks: {
      heading: "Ưu đãi khi chốt combo qua Nếp Núi",
      intro: "Ghép dịch vụ qua Nếp Núi không phát sinh phí ẩn.",
      items: [
        "Giữ nguyên giá niêm yết từng phần, không cộng phí ghép.",
        "Ưu đãi giờ chốt áp dụng cho các combo trong danh sách.",
        "Một đầu mối điều phối toàn bộ chuyến đi.",
        "Điều chỉnh bản nháp không giới hạn trước khi chốt.",
      ],
    },
  },
  addon: {
    why: {
      heading: "Vì sao nên đi Tây Bắc",
      intro: "Vài tiện nghi nhỏ có thể thay đổi toàn bộ trải nghiệm chuyến đi.",
      items: [
        "Di chuyển nội vùng linh hoạt khi bạn không tự lái được.",
        "Người địa phương dẫn đường giúp hiểu đúng văn hóa và tránh điều không nên.",
        "Thiết bị trekking và cắm trại sẵn sàng mà không cần mua mới.",
        "Hỗ trợ riêng cho người cần điều kiện tiếp cận đặc biệt.",
      ],
    },
    experience: {
      heading: "Trải nghiệm khi đặt dịch vụ qua Nếp Núi",
      intro: "Dịch vụ cộng thêm đang được hoàn thiện — bạn có thể gửi nhu cầu trước.",
      items: [
        "Ghi rõ thời gian, địa điểm và số người để nhận báo giá.",
        "Đội tư vấn phản hồi khả năng đáp ứng trong thời gian sớm nhất.",
        "Dịch vụ chỉ triển khai sau khi hai bên xác nhận.",
        "Theo dõi trạng thái yêu cầu trong tài khoản của bạn.",
      ],
    },
    perks: {
      heading: "Ưu đãi khi đặt dịch vụ qua Nếp Núi",
      intro: "Cam kết dịch vụ rõ ràng trước khi phát sinh.",
      items: [
        "Báo giá trước, không phụ thu sau.",
        "Xác nhận khả năng đáp ứng trước khi đặt.",
        "Đổi lịch trước 24 giờ không mất phí với dịch vụ linh hoạt.",
        "Hỗ trợ trực tiếp khi có phát sinh trong chuyến.",
      ],
    },
  },
};

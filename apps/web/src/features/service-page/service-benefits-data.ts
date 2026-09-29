// Noi dung gioi thieu cho 5 trang dich vu: vi sao nen di, trai nghiem khi dat, uu dai khi dat qua Nep Nui.
// Van phong quang ba noi bo, khong dung so lieu dia phuong hay gia cu the ngoai du lieu demo da co.

export type ServiceKey = "tour" | "coach" | "hotel" | "combo" | "addon";

export interface BenefitBlock {
  heading: string;
  intro: string;
  items: string[];
}

export interface BenefitsContent {
  why: BenefitBlock;
  experience: BenefitBlock;
  perks: BenefitBlock;
}

export const serviceBenefits: Record<ServiceKey, BenefitsContent> = {
  tour: {
    why: {
      heading: "Vì sao nên đi Tây Bắc",
      intro: "Vùng núi phía bắc là nơi cảnh quan và nhịp sống đổi thay rõ nhất theo từng cung đường.",
      items: [
        "Ruộng bậc thang, sống núi và thung lũng sương phủ tạo nên khung cảnh khác nhau ở mỗi mùa.",
        "Bản làng, phiên chợ và ẩm thực địa phương gần gũi, dễ tiếp cận với người đi lần đầu.",
        "Khí hậu mát mẻ quanh năm, phù hợp cả chuyến ngắn cuối tuần lẫn hành trình dài ngày.",
        "Mười điểm đến trên Nếp Núi đều có bài viết kèm nguồn tham khảo để tìm hiểu trước.",
      ],
    },
    experience: {
      heading: "Trải nghiệm khi đặt tour qua Nếp Núi",
      intro: "Chọn điểm đến trước, ghép lịch trình sau — mọi thứ nằm trong một luồng.",
      items: [
        "Lọc điểm đến theo cảnh quan và mùa, đọc bài viết trước khi quyết định.",
        "Tạo bản nháp chuyến đi theo số ngày và ưu tiên trải nghiệm của bạn.",
        "Nhận tư vấn lịch trình thực tế trước khi chốt, tránh ghép các chặng quá xa nhau.",
        "Lưu bản nháp trong tài khoản và điều chỉnh bất cứ lúc nào.",
      ],
    },
    perks: {
      heading: "Ưu đãi khi đặt qua Nếp Núi",
      intro: "Đặt trực tiếp qua Nếp Núi đi kèm các quyền lợi áp dụng thống nhất.",
      items: [
        "Giá hiển thị trọn vẹn, không phụ thu ngoài thỏa thuận.",
        "Ưu đãi giờ chốt áp dụng cho danh sách tour đang mở bán.",
        "Xác nhận lịch trình qua tư vấn trước khi thanh toán.",
        "Hỗ trợ điều chỉnh lịch theo chính sách của từng nhà cung cấp.",
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
    why: {
      heading: "Vì sao nên đi Tây Bắc",
      intro: "Ở Tây Bắc, nơi lưu trú không chỉ để ngủ — nơi ở là một phần của trải nghiệm.",
      items: [
        "Homestay bản địa cho bạn bữa tối cùng gia đình chủ nhà và câu chuyện của vùng đất.",
        "Khách sạn tại trung tâm thị trấn thuận tiện di chuyển, phù hợp gia đình.",
        "Nhiều nơi nằm ngay sườn đồi — mở cửa là thấy ruộng bậc thang hoặc biển mây.",
        "Mức giá đa dạng từ tiết kiệm tới tiêu chuẩn, dễ chọn theo ngân sách.",
      ],
    },
    experience: {
      heading: "Trải nghiệm khi đặt phòng qua Nếp Núi",
      intro: "Thông tin rõ trước khi đặt, xác nhận chắc trước khi đến.",
      items: [
        "Xem thông tin phòng, vị trí và chính sách hủy trước khi đặt.",
        "Chọn lưu trú theo khu vực bạn muốn khám phá, không phải theo thành phố.",
        "Ghi chú yêu cầu đặc biệt ngay trong đơn — phòng tầng thấp, ăn sáng sớm…",
        "Nhận xác nhận từ nơi lưu trú trước ngày nhận phòng.",
      ],
    },
    perks: {
      heading: "Ưu đãi khi đặt phòng qua Nếp Núi",
      intro: "Đặt phòng qua Nếp Núi giữ giá niêm yết cùng các quyền lợi đi kèm.",
      items: [
        "Giá phòng hiển thị theo niêm yết — không phụ thu ẩn.",
        "Ưu đãi giờ chốt cho một số khách sạn và homestay trong danh sách.",
        "Hỗ trợ đổi ngày nhận phòng theo chính sách từng nơi.",
        "Quy trình hủy rõ ràng, không ràng buộc ngoài chính sách.",
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

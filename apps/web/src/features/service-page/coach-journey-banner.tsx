import Link from "next/link";
import styles from "./coach-journey-banner.module.css";

export function CoachJourneyBanner() {
  return (
    <section className={styles.banner} aria-labelledby="coach-journey-heading">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Chuyến xe đường dài · Nếp Núi</p>
          <h2 id="coach-journey-heading" className={styles.heading}>
            Lên Tây Bắc,
            <br />
            <em>bắt đầu từ đây.</em>
          </h2>
          <p className={styles.description}>
            Từ Hà Nội, chọn tuyến đến Sa Pa, Hà Giang, Mộc Châu hoặc Mai Châu.
            Xem giờ khởi hành rồi gửi yêu cầu để xác nhận điểm trả khách.
          </p>
          <div className={styles.actions}>
            <Link href="#listing-heading" className={styles.primaryAction}>
              Xem các tuyến xe <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/tai-khoan/yeu-cau-tu-van" className={styles.secondaryAction}>
              Yêu cầu tư vấn <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

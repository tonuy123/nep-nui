import { PlaceholderCard } from "@/components/placeholders/placeholder-card";
import type { LandscapeKind } from "@/components/ui/landscape-art";

const destinations = [
  {
    title: "Địa danh tiêu biểu",
    description: "Dữ liệu địa danh đang được xác minh và sẽ bổ sung sau.",
    art: "terraces",
  },
  {
    title: "Bản làng vùng cao",
    description: "Nội dung đang được xác minh.",
    art: "village",
  },
  {
    title: "Thung lũng ít người biết",
    description: "Nội dung đang được xác minh.",
    art: "valley",
  },
  {
    title: "Cung đường miền núi",
    description: "Nội dung đang được xác minh.",
    art: "trail",
  },
  {
    title: "Điểm dừng chân cộng đồng",
    description: "Nội dung đang được xác minh.",
    art: "ridge",
  },
  {
    title: "Điểm đến ven sông",
    description: "Nội dung đang được xác minh.",
    art: "river",
  },
] satisfies { title: string; description: string; art: LandscapeKind }[];

export function DestinationGridPlaceholder() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {destinations.map((item, index) => (
        <li key={item.title}>
          <PlaceholderCard
            title={item.title}
            description={item.description}
            art={item.art}
            index={String(index + 1).padStart(2, "0")}
          />
        </li>
      ))}
    </ul>
  );
}

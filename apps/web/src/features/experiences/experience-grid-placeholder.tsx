import { PlaceholderCard } from "@/components/placeholders/placeholder-card";
import type { LandscapeKind } from "@/components/ui/landscape-art";

const experiences = [
  {
    title: "Trải nghiệm thiên nhiên",
    description: "Nội dung đang được xác minh.",
    art: "valley",
  },
  {
    title: "Trải nghiệm văn hóa",
    description: "Nội dung đang được xác minh.",
    art: "village",
  },
  {
    title: "Trải nghiệm ẩm thực",
    description: "Nội dung đang được xác minh.",
    art: "terraces",
  },
  {
    title: "Trải nghiệm trekking",
    description: "Nội dung đang được xác minh.",
    art: "ridge",
  },
  {
    title: "Nghề truyền thống",
    description: "Nội dung đang được xác minh.",
    art: "trail",
  },
  {
    title: "Homestay cộng đồng",
    description: "Nội dung đang được xác minh.",
    art: "river",
  },
] satisfies { title: string; description: string; art: LandscapeKind }[];

export function ExperienceGridPlaceholder() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {experiences.map((item, index) => (
        <li key={item.title}>
          <PlaceholderCard
            title={item.title}
            description={item.description}
            badge="Đang biên soạn"
            art={item.art}
            index={String(index + 1).padStart(2, "0")}
          />
        </li>
      ))}
    </ul>
  );
}

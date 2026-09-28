import { PlaceholderCard } from "@/components/placeholders/placeholder-card";
import type { LandscapeKind } from "@/components/ui/landscape-art";

const itineraries = [
  {
    title: "Hành trình 2 ngày",
    description:
      "Lịch trình chi tiết, chi phí ước tính và lưu ý an toàn đang được biên soạn.",
    art: "trail",
  },
  {
    title: "Hành trình 3 ngày",
    description:
      "Lịch trình chi tiết, chi phí ước tính và lưu ý an toàn đang được biên soạn.",
    art: "ridge",
  },
  {
    title: "Hành trình trải nghiệm chậm",
    description:
      "Lịch trình chi tiết, chi phí ước tính và lưu ý an toàn đang được biên soạn.",
    art: "river",
  },
] satisfies { title: string; description: string; art: LandscapeKind }[];

export function ItineraryCardsPlaceholder() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {itineraries.map((item, index) => (
        <li key={item.title}>
          <PlaceholderCard
            title={item.title}
            description={item.description}
            badge="Hành trình mẫu"
            art={item.art}
            index={String(index + 1).padStart(2, "0")}
          />
        </li>
      ))}
    </ul>
  );
}

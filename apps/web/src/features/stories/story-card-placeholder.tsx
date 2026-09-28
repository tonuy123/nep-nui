import { PlaceholderCard } from "@/components/placeholders/placeholder-card";
import type { LandscapeKind } from "@/components/ui/landscape-art";

const stories = [
  {
    title: "Nhịp sống bản làng",
    description: "Tác giả và nguồn: đang cập nhật.",
    art: "village",
  },
  {
    title: "Bàn tay giữ nghề",
    description: "Tác giả và nguồn: đang cập nhật.",
    art: "terraces",
  },
  {
    title: "Một góc nhìn bản địa",
    description: "Tác giả và nguồn: đang cập nhật.",
    art: "valley",
  },
] satisfies { title: string; description: string; art: LandscapeKind }[];

export function StoryCardPlaceholder() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {stories.map((story, index) => (
        <li key={story.title}>
          <PlaceholderCard
            title={story.title}
            description={story.description}
            badge="Đang xác minh"
            art={story.art}
            index={String(index + 1).padStart(2, "0")}
          />
        </li>
      ))}
    </ul>
  );
}

import {
  ContentStatus,
  MediaClearance,
} from "../../src/generated/prisma/enums.js";
import type { PrismaService } from "../../src/database/prisma.service.js";

export const FIXTURE_TIMES = {
  archived: new Date("2026-01-15T00:00:00.000Z"),
  ties: new Date("2026-01-20T00:00:00.000Z"),
  primary: new Date("2026-02-01T00:00:00.000Z"),
  newest: new Date("2026-02-02T00:00:00.000Z"),
} as const;

const excerpt = "Tóm tắt nội dung fixture dùng cho integration test.";
const body = "Nội dung đầy đủ của fixture dùng cho integration test.";

export interface ContentFixtures {
  media: {
    clearedId: string;
    clearedSecondId: string;
    unverifiedId: string;
    blockedId: string;
    badUrlId: string;
  };
  destinations: {
    publishedId: string;
    coverBadId: string;
    draftId: string;
    archivedId: string;
    tieIds: string[];
  };
  experiences: {
    publishedId: string;
  };
  itineraries: {
    publishedId: string;
  };
}

export async function seedContentFixtures(
  prisma: PrismaService,
): Promise<ContentFixtures> {
  return prisma.$transaction(async (tx) => {
    const cleared = await tx.media.create({
      data: {
        publicUrl: "https://cdn.example.test/fixtures/cleared-1.jpg",
        alt: "Fixture cleared 1",
        width: 1200,
        height: 800,
        attribution: "Fixture credit 1",
        source: "fixture:cleared-1",
        clearance: MediaClearance.CLEARED,
      },
    });

    const clearedSecond = await tx.media.create({
      data: {
        publicUrl: "/fixtures/cleared-2.jpg",
        alt: "Fixture cleared 2",
        width: 1024,
        height: 768,
        attribution: null,
        source: "fixture:cleared-2",
        clearance: MediaClearance.CLEARED,
      },
    });

    const unverified = await tx.media.create({
      data: {
        publicUrl: "https://cdn.example.test/fixtures/unverified.jpg",
        alt: "Fixture unverified",
        width: 800,
        height: 600,
        attribution: null,
        source: "fixture:unverified",
        clearance: MediaClearance.UNVERIFIED,
      },
    });

    const blocked = await tx.media.create({
      data: {
        publicUrl: "https://cdn.example.test/fixtures/blocked.jpg",
        alt: "Fixture blocked",
        width: 800,
        height: 600,
        attribution: null,
        source: "fixture:blocked",
        clearance: MediaClearance.BLOCKED,
      },
    });

    const badUrl = await tx.media.create({
      data: {
        publicUrl: "javascript:alert('fixture')",
        alt: "Fixture bad url",
        width: 640,
        height: 480,
        attribution: null,
        source: "fixture:bad-url",
        clearance: MediaClearance.CLEARED,
      },
    });

    const published = await tx.destination.create({
      data: {
        slug: "fx-dest-pub",
        title: "Fixture Điểm đến công khai",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        coverMediaId: cleared.id,
      },
    });

    const coverBad = await tx.destination.create({
      data: {
        slug: "fx-dest-cover-bad",
        title: "Fixture Điểm đến cover lỗi",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        coverMediaId: badUrl.id,
      },
    });

    const draft = await tx.destination.create({
      data: {
        slug: "fx-dest-draft",
        title: "Fixture Điểm đến nháp",
        excerpt,
        body,
        status: ContentStatus.DRAFT,
      },
    });

    const archived = await tx.destination.create({
      data: {
        slug: "fx-dest-archived",
        title: "Fixture Điểm đến lưu trữ",
        excerpt,
        body,
        status: ContentStatus.ARCHIVED,
        publishedAt: FIXTURE_TIMES.archived,
      },
    });

    const tieIds: string[] = [];

    for (let index = 1; index <= 7; index += 1) {
      const tie = await tx.destination.create({
        data: {
          slug: `fx-tie-${index}`,
          title: `Fixture tie ${index}`,
          excerpt,
          body,
          status: ContentStatus.PUBLISHED,
          publishedAt: FIXTURE_TIMES.ties,
        },
      });
      tieIds.push(tie.id);
    }

    await tx.destinationMedia.createMany({
      data: [
        { destinationId: published.id, mediaId: cleared.id, position: 0 },
        { destinationId: published.id, mediaId: unverified.id, position: 1 },
        { destinationId: published.id, mediaId: blocked.id, position: 2 },
        { destinationId: published.id, mediaId: clearedSecond.id, position: 3 },
      ],
    });

    const experiencePublished = await tx.experience.create({
      data: {
        slug: "fx-exp-pub",
        title: "Fixture Trải nghiệm công khai",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: published.id,
        coverMediaId: cleared.id,
      },
    });

    await tx.experience.create({
      data: {
        slug: "fx-exp-cover-unverified",
        title: "Fixture Trải nghiệm cover chưa xác minh",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: published.id,
        coverMediaId: unverified.id,
      },
    });

    await tx.experience.create({
      data: {
        slug: "fx-exp-parent-draft",
        title: "Fixture Trải nghiệm thuộc destination nháp",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: draft.id,
      },
    });

    await tx.experience.create({
      data: {
        slug: "fx-exp-parent-archived",
        title: "Fixture Trải nghiệm thuộc destination lưu trữ",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: archived.id,
      },
    });

    await tx.experience.create({
      data: {
        slug: "fx-exp-draft",
        title: "Fixture Trải nghiệm nháp",
        excerpt,
        body,
        status: ContentStatus.DRAFT,
        destinationId: published.id,
      },
    });

    await tx.experience.create({
      data: {
        slug: "fx-exp-archived",
        title: "Fixture Trải nghiệm lưu trữ",
        excerpt,
        body,
        status: ContentStatus.ARCHIVED,
        publishedAt: FIXTURE_TIMES.archived,
        destinationId: published.id,
      },
    });

    const itinerary = await tx.itinerary.create({
      data: {
        slug: "fx-itin-pub",
        title: "Fixture Hành trình công khai",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
      },
    });

    await tx.itineraryDay.createMany({
      data: [
        {
          itineraryId: itinerary.id,
          dayNumber: 1,
          title: "Ngày 1",
          content: "Nội dung ngày 1 (destination công khai).",
          destinationId: published.id,
        },
        {
          itineraryId: itinerary.id,
          dayNumber: 2,
          title: "Ngày 2",
          content: "Nội dung ngày 2 (destination nháp).",
          destinationId: draft.id,
        },
        {
          itineraryId: itinerary.id,
          dayNumber: 3,
          title: null,
          content: "Nội dung ngày 3 (không gắn destination).",
          destinationId: null,
        },
      ],
    });

    const itineraryDraft = await tx.itinerary.create({
      data: {
        slug: "fx-itin-draft",
        title: "Fixture Hành trình nháp",
        excerpt,
        body,
        status: ContentStatus.DRAFT,
      },
    });

    await tx.itineraryDay.create({
      data: {
        itineraryId: itineraryDraft.id,
        dayNumber: 1,
        content: "Nội dung ngày của hành trình nháp.",
      },
    });

    const itineraryArchived = await tx.itinerary.create({
      data: {
        slug: "fx-itin-archived",
        title: "Fixture Hành trình lưu trữ",
        excerpt,
        body,
        status: ContentStatus.ARCHIVED,
        publishedAt: FIXTURE_TIMES.archived,
      },
    });

    await tx.itineraryDay.create({
      data: {
        itineraryId: itineraryArchived.id,
        dayNumber: 1,
        content: "Nội dung ngày của hành trình lưu trữ.",
      },
    });

    await tx.story.create({
      data: {
        slug: "fx-story-nodest",
        title: "Fixture Câu chuyện không destination",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.newest,
      },
    });

    await tx.story.create({
      data: {
        slug: "fx-story-with-dest",
        title: "Fixture Câu chuyện có destination",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: published.id,
      },
    });

    await tx.story.create({
      data: {
        slug: "fx-story-parent-draft",
        title: "Fixture Câu chuyện thuộc destination nháp",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: draft.id,
      },
    });

    await tx.story.create({
      data: {
        slug: "fx-story-parent-archived",
        title: "Fixture Câu chuyện thuộc destination lưu trữ",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: archived.id,
      },
    });

    await tx.story.create({
      data: {
        slug: "fx-story-draft",
        title: "Fixture Câu chuyện nháp",
        excerpt,
        body,
        status: ContentStatus.DRAFT,
      },
    });

    await tx.story.create({
      data: {
        slug: "fx-story-archived",
        title: "Fixture Câu chuyện lưu trữ",
        excerpt,
        body,
        status: ContentStatus.ARCHIVED,
        publishedAt: FIXTURE_TIMES.archived,
      },
    });

    await tx.guide.create({
      data: {
        slug: "fx-guide-nodest",
        title: "Fixture Cẩm nang không destination",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.newest,
      },
    });

    await tx.guide.create({
      data: {
        slug: "fx-guide-with-dest",
        title: "Fixture Cẩm nang có destination",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: published.id,
      },
    });

    await tx.guide.create({
      data: {
        slug: "fx-guide-parent-draft",
        title: "Fixture Cẩm nang thuộc destination nháp",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: draft.id,
      },
    });

    await tx.guide.create({
      data: {
        slug: "fx-guide-parent-archived",
        title: "Fixture Cẩm nang thuộc destination lưu trữ",
        excerpt,
        body,
        status: ContentStatus.PUBLISHED,
        publishedAt: FIXTURE_TIMES.primary,
        destinationId: archived.id,
      },
    });

    await tx.guide.create({
      data: {
        slug: "fx-guide-draft",
        title: "Fixture Cẩm nang nháp",
        excerpt,
        body,
        status: ContentStatus.DRAFT,
      },
    });

    await tx.guide.create({
      data: {
        slug: "fx-guide-archived",
        title: "Fixture Cẩm nang lưu trữ",
        excerpt,
        body,
        status: ContentStatus.ARCHIVED,
        publishedAt: FIXTURE_TIMES.archived,
      },
    });

    return {
      media: {
        clearedId: cleared.id,
        clearedSecondId: clearedSecond.id,
        unverifiedId: unverified.id,
        blockedId: blocked.id,
        badUrlId: badUrl.id,
      },
      destinations: {
        publishedId: published.id,
        coverBadId: coverBad.id,
        draftId: draft.id,
        archivedId: archived.id,
        tieIds,
      },
      experiences: { publishedId: experiencePublished.id },
      itineraries: { publishedId: itinerary.id },
    };
  });
}

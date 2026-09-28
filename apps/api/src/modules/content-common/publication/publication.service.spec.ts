import { NotFoundException } from "@nestjs/common";
import { jest } from "@jest/globals";
import {
  ContentNotFoundError,
  InvalidTransitionError,
  PublicationValidationError,
} from "../errors.js";
import { PublicationService } from "./publication.service.js";
import type {
  PublicationRecord,
  PublicationRepository,
  PublicationUpdate,
  PublishableResource,
} from "./publication.types.js";

const baseRecord: PublicationRecord = {
  id: "3f2504e0-4f89-4c1a-9a0d-0305e82c3301",
  slug: "mau-noi-dung",
  title: "Mau noi dung",
  excerpt: "Tom tat hop le",
  body: "Noi dung day du",
  status: "DRAFT",
  publishedAt: null,
  destinationId: null,
  destinationStatus: null,
  dayContents: null,
};

class FakeTransitionRepository implements PublicationRepository {
  readonly updates: PublicationUpdate[] = [];
  readonly decideCalls: Array<PublicationUpdate | null> = [];

  constructor(
    private record: PublicationRecord | null,
    private readonly repeatDecide = 1,
  ) {}

  transition(
    _resource: PublishableResource,
    _id: string,
    decide: (record: PublicationRecord | null) => PublicationUpdate | null,
  ): Promise<PublicationRecord> {
    const snapshot = this.record;
    let update: PublicationUpdate | null = null;

    for (let index = 0; index < this.repeatDecide; index += 1) {
      update = decide(snapshot);
      this.decideCalls.push(update);
    }

    if (update === null) {
      if (snapshot === null) {
        return Promise.reject(new ContentNotFoundError());
      }

      return Promise.resolve(snapshot);
    }

    if (snapshot === null) {
      return Promise.reject(new ContentNotFoundError());
    }

    this.updates.push(update);
    this.record = {
      ...snapshot,
      status: update.status,
      publishedAt: update.publishedAt ?? snapshot.publishedAt,
    };

    return Promise.resolve(this.record);
  }

  patch(record: Partial<PublicationRecord>): void {
    if (this.record) {
      this.record = { ...this.record, ...record };
    }
  }
}

function createService(record: PublicationRecord | null, repeatDecide = 1) {
  const repository = new FakeTransitionRepository(record, repeatDecide);
  return { service: new PublicationService(repository), repository };
}

describe("PublicationService (rules)", () => {
  it("publish destination hop le: set status va publishedAt", async () => {
    const { service, repository } = createService({ ...baseRecord });

    const result = await service.publish("destination", baseRecord.id);

    expect(result.status).toBe("PUBLISHED");
    expect(result.publishedAt).toBeInstanceOf(Date);
    expect(repository.updates).toHaveLength(1);
  });

  it("publish lai la no-op, khong doi publishedAt", async () => {
    const publishedAt = new Date("2026-02-01T00:00:00.000Z");
    const { service, repository } = createService({
      ...baseRecord,
      status: "PUBLISHED",
      publishedAt,
    });

    const result = await service.publish("destination", baseRecord.id);

    expect(result.publishedAt).toEqual(publishedAt);
    expect(repository.updates).toHaveLength(0);
    expect(repository.decideCalls).toEqual([null]);
  });

  it("publish tu ARCHIVED bi tu choi bang typed error", async () => {
    const { service } = createService({ ...baseRecord, status: "ARCHIVED" });

    await expect(service.publish("destination", baseRecord.id)).rejects.toThrow(
      InvalidTransitionError,
    );
  });

  it("archive tu DRAFT bi tu choi; archive tu PUBLISHED giu publishedAt", async () => {
    const draft = createService({ ...baseRecord });
    await expect(
      draft.service.archive("destination", baseRecord.id),
    ).rejects.toThrow(InvalidTransitionError);

    const publishedAt = new Date("2026-02-01T00:00:00.000Z");
    const published = createService({
      ...baseRecord,
      status: "PUBLISHED",
      publishedAt,
    });
    const result = await published.service.archive(
      "destination",
      baseRecord.id,
    );

    expect(result.status).toBe("ARCHIVED");
    expect(result.publishedAt).toEqual(publishedAt);
    expect(published.repository.updates[0]).toEqual({ status: "ARCHIVED" });
  });

  it("archive archive lai la no-op", async () => {
    const { service, repository } = createService({
      ...baseRecord,
      status: "ARCHIVED",
      publishedAt: new Date(),
    });

    const result = await service.archive("destination", baseRecord.id);

    expect(result.status).toBe("ARCHIVED");
    expect(repository.updates).toHaveLength(0);
  });

  it("thieu truong bat buoc thi tu choi voi details", async () => {
    const { service } = createService({
      ...baseRecord,
      excerpt: null,
      body: "   ",
    });

    try {
      await service.publish("destination", baseRecord.id);
      throw new Error("expected PublicationValidationError");
    } catch (error) {
      expect(error).toBeInstanceOf(PublicationValidationError);
      const fields = ((error as PublicationValidationError).details ?? []).map(
        (detail) => detail.field,
      );
      expect(fields.sort()).toEqual(["body", "excerpt"]);
    }
  });

  it("experience chi publish khi destination PUBLISHED", async () => {
    const draftParent = createService({
      ...baseRecord,
      destinationId: "parent-id",
      destinationStatus: "DRAFT",
    });
    await expect(
      draftParent.service.publish("experience", baseRecord.id),
    ).rejects.toThrow(PublicationValidationError);

    const publishedParent = createService({
      ...baseRecord,
      destinationId: "parent-id",
      destinationStatus: "PUBLISHED",
    });
    const result = await publishedParent.service.publish(
      "experience",
      baseRecord.id,
    );
    expect(result.status).toBe("PUBLISHED");
  });

  it("story/guide voi destination null van publish duoc", async () => {
    for (const resource of ["story", "guide"] as const) {
      const { service } = createService({ ...baseRecord });
      const result = await service.publish(resource, baseRecord.id);
      expect(result.status).toBe("PUBLISHED");
    }
  });

  it("story/guide voi destination draft bi tu choi", async () => {
    for (const resource of ["story", "guide"] as const) {
      const { service } = createService({
        ...baseRecord,
        destinationId: "parent-id",
        destinationStatus: "ARCHIVED",
      });
      await expect(service.publish(resource, baseRecord.id)).rejects.toThrow(
        PublicationValidationError,
      );
    }
  });

  it("record khong ton tai tra ContentNotFoundError", async () => {
    const { service } = createService(null);

    await expect(service.publish("destination", "missing")).rejects.toThrow(
      ContentNotFoundError,
    );
  });

  it("NotFoundException cua Nest khong bi nham la ContentNotFoundError", () => {
    expect(new NotFoundException()).not.toBeInstanceOf(ContentNotFoundError);
  });

  it("proposed publishedAt duoc capture mot lan cho ca retry", async () => {
    const { service, repository } = createService({ ...baseRecord }, 2);

    await service.publish("destination", baseRecord.id);

    const [firstCall, secondCall] = repository.decideCalls;
    expect(firstCall).not.toBeNull();
    expect(secondCall).not.toBeNull();
    expect(firstCall?.publishedAt).toBe(secondCall?.publishedAt);
  });
});

describe("PublicationService itinerary day validation", () => {
  const itineraryRecord = (dayContents: string[]): PublicationRecord => ({
    ...baseRecord,
    dayContents,
  });

  it("itinerary khong co ngay bi tu choi", async () => {
    const { service } = createService(itineraryRecord([]));
    await expect(service.publish("itinerary", baseRecord.id)).rejects.toThrow(
      PublicationValidationError,
    );
  });

  it("ngay blank giua cac ngay hop le bi tu choi", async () => {
    const { service } = createService(itineraryRecord(["Ngay 1", "   ", "Ngay 3"]));

    try {
      await service.publish("itinerary", baseRecord.id);
      throw new Error("expected PublicationValidationError");
    } catch (error) {
      expect(error).toBeInstanceOf(PublicationValidationError);
      const messages = (
        (error as PublicationValidationError).details ?? []
      ).map((detail) => detail.message);
      expect(messages.join(" ")).toContain("day 2");
    }
  });

  it("day content vuot 5000 code points bi tu choi", async () => {
    const oversized = "a".repeat(5_001);
    const { service } = createService(itineraryRecord([oversized]));

    await expect(service.publish("itinerary", baseRecord.id)).rejects.toThrow(
      PublicationValidationError,
    );
  });

  it("day content dung 5000 code points publish duoc", async () => {
    const exact = "😀".repeat(5_000);
    const { service } = createService(itineraryRecord([exact]));

    const result = await service.publish("itinerary", baseRecord.id);
    expect(result.status).toBe("PUBLISHED");
  });
});

describe("PublicationService content bounds", () => {
  it.each([
    ["body whitespace", "destination", " ".repeat(1_000_000), "body", 20_000],
    ["body Unicode", "destination", "😀".repeat(20_001), "body", 20_000],
    ["day whitespace", "itinerary", " ".repeat(1_000_000), "days", 5_000],
    ["day Unicode", "itinerary", "😀".repeat(5_001), "days", 5_000],
  ] as const)(
    "%s rejects the raw length before trimming",
    async (_label, resource, content, field, limit) => {
      const { service, repository } = createService({
        ...baseRecord,
        ...(resource === "itinerary"
          ? { dayContents: [content] }
          : { body: content }),
      });
      const originalTrim = String.prototype.trim;
      let oversizedTrimCalls = 0;
      const trimSpy = jest
        .spyOn(String.prototype, "trim")
        .mockImplementation(function (this: string) {
          if (this === content) {
            oversizedTrimCalls += 1;
          }

          return originalTrim.call(this);
        });

      try {
        await expect(
          service.publish(resource, baseRecord.id),
        ).rejects.toMatchObject({
          details: [
            {
              field,
              message:
                field === "body"
                  ? `body must not exceed ${limit} code points.`
                  : `day 1 content must not exceed ${limit} code points.`,
            },
          ],
        });
        expect(oversizedTrimCalls).toBe(0);
        expect(repository.updates).toHaveLength(0);
      } finally {
        trimSpy.mockRestore();
      }
    },
  );

  it("exact raw bounds with whitespace padding still publish", async () => {
    const { service } = createService({
      ...baseRecord,
      body: ` ${"😀".repeat(19_998)} `,
      dayContents: [` ${"😀".repeat(4_998)} `],
    });

    await expect(
      service.publish("itinerary", baseRecord.id),
    ).resolves.toMatchObject({
      status: "PUBLISHED",
    });
  });

  it("body vuot 20000 code points bi tu choi khi publish", async () => {
    const oversizedBody = "a".repeat(20_001);
    const { service, repository } = createService({
      ...baseRecord,
      body: oversizedBody,
    });

    await expect(
      service.publish("destination", baseRecord.id),
    ).rejects.toThrow(PublicationValidationError);
    expect(repository.updates).toHaveLength(0);
  });

  it("body dung 20000 code points publish duoc", async () => {
    const { service } = createService({
      ...baseRecord,
      body: "a".repeat(20_000),
    });

    const result = await service.publish("destination", baseRecord.id);
    expect(result.status).toBe("PUBLISHED");
  });

  it("emoji: 20000 emoji hop le, 20001 emoji bi tu choi (code points)", async () => {
    const exact = "😀".repeat(20_000);
    expect(exact.length).toBe(40_000);

    const { service: exactService } = createService({
      ...baseRecord,
      body: exact,
    });
    await expect(
      exactService.publish("destination", baseRecord.id),
    ).resolves.toMatchObject({ status: "PUBLISHED" });

    const oversized = "😀".repeat(20_001);
    const { service: oversizedService } = createService({
      ...baseRecord,
      body: oversized,
    });
    await expect(
      oversizedService.publish("destination", baseRecord.id),
    ).rejects.toThrow(PublicationValidationError);
  });
});

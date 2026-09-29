import { ContentApiError } from "../content-common/errors.js";
import {
  parseAdminListQuery,
  parseContentCreate,
  parseContentUpdate,
  parseGalleryBody,
  parseIdParam,
  parseMediaCreate,
  parseMediaUpdate,
  parseResourceParam,
  parseUserListQuery,
  parseUserUpdate,
} from "./admin.dto.js";

const UUID = "0f9a1f16-4a2d-4a3f-9d0e-6a2b1c3d4e5f";

function expectInvalid(fn: () => unknown, code = "INVALID_BODY"): void {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(ContentApiError);
    expect((error as ContentApiError).code).toBe(code);
    return;
  }
  throw new Error("Expected an invalid request error.");
}

describe("admin.dto", () => {
  describe("parseResourceParam", () => {
    it("accepts known resources and rejects others", () => {
      expect(parseResourceParam("destinations")).toBe("destinations");
      expect(parseResourceParam("guides")).toBe("guides");
      expectInvalid(() => parseResourceParam("users"), "INVALID_QUERY");
      expectInvalid(() => parseResourceParam(12), "INVALID_QUERY");
    });
  });

  describe("parseIdParam", () => {
    it("requires a uuid", () => {
      expect(parseIdParam(UUID)).toBe(UUID);
      expectInvalid(() => parseIdParam("not-a-uuid"), "INVALID_QUERY");
    });
  });

  describe("parseAdminListQuery", () => {
    it("defaults and bounds", () => {
      expect(parseAdminListQuery({})).toEqual({
        status: null,
        q: null,
        page: 1,
        limit: 20,
        offset: 0,
      });
      expect(parseAdminListQuery({ status: "DRAFT", q: " sa ", page: "2", limit: "10" })).toEqual({
        status: "DRAFT",
        q: "sa",
        page: 2,
        limit: 10,
        offset: 10,
      });
      expectInvalid(() => parseAdminListQuery({ status: "UNKNOWN" }), "INVALID_QUERY");
      expectInvalid(() => parseAdminListQuery({ limit: "51" }), "INVALID_QUERY");
      expectInvalid(() => parseAdminListQuery({ limit: "0" }), "INVALID_QUERY");
      expectInvalid(() => parseAdminListQuery({ page: "-1" }), "INVALID_QUERY");
      expectInvalid(() => parseAdminListQuery({ unexpected: "1" }), "INVALID_QUERY");
    });
  });

  describe("content create", () => {
    const base = { slug: "sa-pa", title: "Sa Pa" };

    it("normalizes optional fields", () => {
      const input = parseContentCreate("destinations", {
        ...base,
        excerpt: "",
        body: null,
        galleryMediaIds: [UUID],
      });
      expect(input).toEqual({
        slug: "sa-pa",
        title: "Sa Pa",
        excerpt: null,
        body: null,
        province: null,
        landscape: null,
        travelNote: null,
        highlights: [],
        sourceUrl: null,
        destinationId: null,
        coverMediaId: null,
        days: [],
        galleryMediaIds: [UUID],
      });
    });

    it("parses editorial fields for destinations with bounds", () => {
      const input = parseContentCreate("destinations", {
        ...base,
        province: "Lào Cai",
        landscape: "Thung lũng & ruộng bậc thang",
        travelNote: "Đường núi đổi thời tiết nhanh.",
        highlights: ["Đi bộ Mường Hoa", "Tìm hiểu bản địa"],
        sourceUrl: "https://www.vietnam.travel/vi/places-to-go/northern-vietnam/sapa",
      });
      expect(input.province).toBe("Lào Cai");
      expect(input.highlights).toHaveLength(2);
      expect(input.sourceUrl).toContain("vietnam.travel");
      expectInvalid(() =>
        parseContentCreate("destinations", {
          ...base,
          highlights: Array.from({ length: 9 }, () => "x"),
        }),
      );
      expectInvalid(() =>
        parseContentCreate("destinations", { ...base, sourceUrl: "javascript:alert(1)" }),
      );
      expectInvalid(() =>
        parseContentCreate("destinations", { ...base, province: "x".repeat(81) }),
      );
      expectInvalid(() => parseContentCreate("guides", { ...base, province: "Lào Cai" }));
    });

    it("rejects invalid slug, unknown keys and duplicate gallery", () => {
      expectInvalid(() => parseContentCreate("guides", { ...base, slug: "Sa Pa" }));
      expectInvalid(() => parseContentCreate("guides", { ...base, extra: 1 }));
      expectInvalid(() =>
        parseContentCreate("destinations", { ...base, galleryMediaIds: [UUID, UUID] }),
      );
    });

    it("requires destination for experiences and validates days for itineraries", () => {
      expectInvalid(() => parseContentCreate("experiences", base));
      const experience = parseContentCreate("experiences", {
        ...base,
        destinationId: UUID,
      });
      expect(experience.destinationId).toBe(UUID);
      expectInvalid(() =>
        parseContentCreate("itineraries", {
          ...base,
          days: [{ content: "  " }],
        }),
      );
      expectInvalid(() =>
        parseContentCreate("itineraries", {
          ...base,
          days: Array.from({ length: 31 }, () => ({ content: "Ngày" })),
        }),
      );
      const itinerary = parseContentCreate("itineraries", {
        ...base,
        days: [{ title: null, content: "Khởi hành", destinationId: null }],
      });
      expect(itinerary.days).toHaveLength(1);
    });
  });

  describe("content update", () => {
    it("requires at least one field and blocks unknown keys", () => {
      expectInvalid(() => parseContentUpdate("stories", {}));
      expectInvalid(() => parseContentUpdate("stories", { unsupported: 1 }));
      expect(parseContentUpdate("stories", { excerpt: null })).toEqual({ excerpt: null });
    });

    it("keeps experience destination non-null on update", () => {
      expectInvalid(() => parseContentUpdate("experiences", { destinationId: null }));
      expect(parseContentUpdate("experiences", { destinationId: UUID })).toEqual({
        destinationId: UUID,
      });
    });
  });

  describe("gallery body", () => {
    it("requires a bounded unique uuid list", () => {
      expect(parseGalleryBody({ mediaIds: [UUID] })).toEqual([UUID]);
      expectInvalid(() => parseGalleryBody({ mediaIds: [UUID, UUID] }));
      expectInvalid(() => parseGalleryBody({}));
    });
  });

  describe("media", () => {
    it("validates publicUrl and dimensions", () => {
      const input = parseMediaCreate({
        publicUrl: "/images/destinations/sa-pa.webp",
        alt: "Ruộng bậc thang Sa Pa",
        width: 1200,
        height: 900,
      });
      expect(input.clearance).toBe("UNVERIFIED");
      expectInvalid(() =>
        parseMediaCreate({
          publicUrl: "javascript:alert(1)",
          alt: "x",
          width: 1,
          height: 1,
        }),
      );
      expectInvalid(() =>
        parseMediaCreate({
          publicUrl: "//evil.example/x.png",
          alt: "x",
          width: 1,
          height: 1,
        }),
      );
      expectInvalid(() =>
        parseMediaCreate({
          publicUrl: "/images/../secret.png",
          alt: "x",
          width: 1,
          height: 1,
        }),
      );
      expectInvalid(() =>
        parseMediaCreate({
          publicUrl: "https://example.com/x.png",
          alt: "x",
          width: 0,
          height: 10,
        }),
      );
    });

    it("requires a change on update", () => {
      expectInvalid(() => parseMediaUpdate({}));
      expect(parseMediaUpdate({ clearance: "CLEARED" })).toEqual({
        clearance: "CLEARED",
      });
    });
  });

  describe("users", () => {
    it("parses filters and validates update payloads", () => {
      expect(parseUserListQuery({ role: "EDITOR", status: "ACTIVE", q: "an" })).toEqual({
        role: "EDITOR",
        status: "ACTIVE",
        q: "an",
        page: 1,
        limit: 20,
        offset: 0,
      });
      expectInvalid(() => parseUserListQuery({ role: "OWNER" }), "INVALID_QUERY");
      expect(parseUserUpdate({ role: "ADMIN" })).toEqual({ role: "ADMIN" });
      expectInvalid(() => parseUserUpdate({}));
      expectInvalid(() => parseUserUpdate({ role: "SUPER" }));
    });
  });
});

import { decodeCursor, encodeCursor } from "./cursor.js";
import { InternalError, ValidationError } from "./errors.js";

const publishedAt = new Date("2026-03-01T10:20:30.123Z");
const id = "3f2504e0-4f89-4c1a-9a0d-0305e82c3301";

describe("cursor codec", () => {
  it("encode/decode roundtrip", () => {
    const cursor = encodeCursor("destinations", publishedAt, id, null);
    const decoded = decodeCursor(cursor, {
      resource: "destinations",
      filter: null,
    });

    expect(decoded.publishedAt.toISOString()).toBe(publishedAt.toISOString());
    expect(decoded.id).toBe(id);
  });

  it("ho tro filter context", () => {
    const cursor = encodeCursor("experiences", publishedAt, id, "vung-cao");
    const decoded = decodeCursor(cursor, {
      resource: "experiences",
      filter: "vung-cao",
    });

    expect(decoded.id).toBe(id);
  });

  it("tu choi cursor sai resource hoac sai filter", () => {
    const cursor = encodeCursor("experiences", publishedAt, id, "vung-cao");

    expect(() =>
      decodeCursor(cursor, { resource: "stories", filter: "vung-cao" }),
    ).toThrow(ValidationError);
    expect(() =>
      decodeCursor(cursor, { resource: "experiences", filter: null }),
    ).toThrow(ValidationError);
    expect(() =>
      decodeCursor(cursor, { resource: "experiences", filter: "khac" }),
    ).toThrow(ValidationError);
  });

  it("tu choi cursor khong phai base64url/JSON hop le", () => {
    expect(() =>
      decodeCursor("!!!not-base64!!!", { resource: "destinations", filter: null }),
    ).toThrow(ValidationError);
    expect(() =>
      decodeCursor(Buffer.from("plain text").toString("base64url"), {
        resource: "destinations",
        filter: null,
      }),
    ).toThrow(ValidationError);
  });

  it("tu choi payload sai version, sai timestamp hoac sai id", () => {
    const build = (payload: unknown) =>
      Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");

    expect(() =>
      decodeCursor(
        build({ v: 2, r: "destinations", t: publishedAt.toISOString(), i: id, f: null }),
        { resource: "destinations", filter: null },
      ),
    ).toThrow(ValidationError);

    expect(() =>
      decodeCursor(
        build({ v: 1, r: "destinations", t: "2026-03-01T10:20:30Z", i: id, f: null }),
        { resource: "destinations", filter: null },
      ),
    ).toThrow(ValidationError);

    expect(() =>
      decodeCursor(
        build({ v: 1, r: "destinations", t: publishedAt.toISOString(), i: "not-a-uuid", f: null }),
        { resource: "destinations", filter: null },
      ),
    ).toThrow(ValidationError);
  });

  it("tu choi encoding khong canonical", () => {
    const canonical = encodeCursor("destinations", publishedAt, id, null);
    const payload = Buffer.from(canonical, "base64url").toString("utf8");
    const reordered = JSON.parse(payload) as Record<string, unknown>;
    const shuffled = {
      i: reordered.i,
      r: reordered.r,
      t: reordered.t,
      v: reordered.v,
      f: reordered.f,
    };
    const nonCanonical = Buffer.from(
      JSON.stringify(shuffled),
      "utf8",
    ).toString("base64url");

    expect(nonCanonical).not.toBe(canonical);
    expect(() =>
      decodeCursor(nonCanonical, { resource: "destinations", filter: null }),
    ).toThrow(ValidationError);
  });

  describe("date domain", () => {
    const build = (payload: unknown) =>
      Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");

    it("roundtrip nam 0001 va 9999", () => {
      const boundaries = [
        "0001-01-01T00:00:00.000Z",
        "9999-12-31T23:59:59.999Z",
      ];

      for (const iso of boundaries) {
        const cursor = encodeCursor("destinations", new Date(iso), id, null);
        const decoded = decodeCursor(cursor, {
          resource: "destinations",
          filter: null,
        });

        expect(decoded.publishedAt.toISOString()).toBe(iso);
      }
    });

    it("tu choi nam 0000, nam mo rong, offset va ngay khong hop le", () => {
      const invalidTimestamps = [
        "0000-01-01T00:00:00.000Z",
        "+010000-01-01T00:00:00.000Z",
        "-000001-01-01T00:00:00.000Z",
        "10000-01-01T00:00:00.000Z",
        "2026-02-30T00:00:00.000Z",
        "2026-13-01T00:00:00.000Z",
        "2026-03-01T10:20:30Z",
        "2026-03-01T10:20:30.120+07:00",
        "2026-03-01T10:20:30.120",
      ];

      for (const timestamp of invalidTimestamps) {
        expect(() =>
          decodeCursor(
            build({ v: 1, r: "destinations", t: timestamp, i: id, f: null }),
            { resource: "destinations", filter: null },
          ),
        ).toThrow(ValidationError);
      }
    });

    it("encode chan Date ngoai domain bang internal error", () => {
      expect(() =>
        encodeCursor("destinations", new Date("0000-01-01T00:00:00.000Z"), id, null),
      ).toThrow(InternalError);
      expect(() =>
        encodeCursor("destinations", new Date(Number.NaN), id, null),
      ).toThrow(InternalError);
    });
  });
});

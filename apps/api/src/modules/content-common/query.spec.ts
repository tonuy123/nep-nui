import { ValidationError } from "./errors.js";
import { DEFAULT_LIMIT, parseListQuery } from "./query.js";

const allowFilter = { allowDestinationFilter: true };
const noFilter = { allowDestinationFilter: false };

describe("parseListQuery", () => {
  it("tra default limit va null cursor khi query rong", () => {
    const query = parseListQuery({}, noFilter);

    expect(query).toEqual({
      limit: DEFAULT_LIMIT,
      cursor: null,
      destinationSlug: null,
    });
  });

  it("nhan limit, cursor va destinationSlug hop le", () => {
    const query = parseListQuery(
      { limit: "50", cursor: "abcDEF_123", destinationSlug: "vung-cao-abc" },
      allowFilter,
    );

    expect(query.limit).toBe(50);
    expect(query.cursor).toBe("abcDEF_123");
    expect(query.destinationSlug).toBe("vung-cao-abc");
  });

  it("tu choi unknown query param", () => {
    expect(() => parseListQuery({ foo: "1" }, noFilter)).toThrow(
      ValidationError,
    );
    expect(() => parseListQuery({ status: "PUBLISHED" }, noFilter)).toThrow(
      ValidationError,
    );
  });

  it("tu choi array/repeated params", () => {
    expect(() => parseListQuery({ limit: ["1", "2"] }, noFilter)).toThrow(
      ValidationError,
    );
    expect(() => parseListQuery({ cursor: ["a", "b"] }, noFilter)).toThrow(
      ValidationError,
    );
  });

  it("tu choi limit 0, am, decimal, boolean, oversize, leading zero", () => {
    for (const limit of ["0", "-1", "1.5", "true", "51", "012", "", "1e2", " 5"]) {
      expect(() => parseListQuery({ limit }, noFilter)).toThrow(ValidationError);
    }
  });

  it("tu choi cursor malformed hoac qua dai", () => {
    expect(() => parseListQuery({ cursor: "short" }, noFilter)).toThrow(
      ValidationError,
    );
    expect(() =>
      parseListQuery({ cursor: "A".repeat(600) }, noFilter),
    ).toThrow(ValidationError);
    expect(() => parseListQuery({ cursor: "bad+/=chars" }, noFilter)).toThrow(
      ValidationError,
    );
  });

  it("tu choi destinationSlug voi resource khong ho tro", () => {
    expect(() =>
      parseListQuery({ destinationSlug: "abc" }, noFilter),
    ).toThrow(ValidationError);
  });

  it("tu choi destinationSlug sai format", () => {
    for (const slug of ["ABC", "a_b", "-abc", "abc-", "a".repeat(121), "a b"]) {
      expect(() =>
        parseListQuery({ destinationSlug: slug }, allowFilter),
      ).toThrow(ValidationError);
    }
  });

  it("gom nhieu loi vao details", () => {
    try {
      parseListQuery({ unknown: "1", limit: "0" }, noFilter);
      throw new Error("expected ValidationError");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const details = (error as ValidationError).details ?? [];
      expect(details.map((detail) => detail.field).sort()).toEqual([
        "limit",
        "unknown",
      ]);
    }
  });
});

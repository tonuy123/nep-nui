import { assertEmptyBody, parseInquiry, parseInquiryQuery, parsePasswordChange, parseProfile } from "./me.dto.js";

describe("me request boundaries", () => {
  it("checks raw code points before trimming", () => {
    expect(parseProfile({ name: "  Paw  " })).toEqual({ name: "Paw" });
    expect(parseProfile({ name: String.fromCodePoint(0x1f600).repeat(100) }).name).toHaveLength(200);
    for (const name of [null, true, [], " ", " ".repeat(100) + "Paw", "x".repeat(101)]) {
      expect(() => parseProfile({ name })).toThrow();
    }
    expect(() => parseProfile({ name: "Paw", role: "ADMIN" })).toThrow();
  });
  it("never trims passwords and rejects wrong shapes and bounds", () => {
    const password = " ".repeat(12);
    expect(parsePasswordChange({ currentPassword: password, newPassword: password }).newPassword).toBe(password);
    for (const newPassword of [true, [], "x".repeat(11), "x".repeat(129)]) {
      expect(() => parsePasswordChange({ currentPassword: "x".repeat(12), newPassword })).toThrow();
    }
  });
  it("bounds inquiry raw text and validates optional destination", () => {
    expect(parseInquiry({ subject: " Ask ", message: " Help " })).toEqual({ subject: "Ask", message: "Help" });
    for (const body of [
      { subject: "x".repeat(161), message: "Help" },
      { subject: "Ask", message: " ".repeat(2000) + "Help" },
      { subject: "Ask", message: "Help", destinationSlug: null },
      { subject: "Ask", message: "Help", userId: "other" },
    ]) expect(() => parseInquiry(body)).toThrow();
  });
  it("rejects repeated/coerced/unknown/over-offset pagination", () => {
    expect(parseInquiryQuery({})).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(parseInquiryQuery({ page: "201", limit: "50" }).offset).toBe(10000);
    for (const query of [
      { page: "202", limit: "50" }, { limit: "51" }, { page: "0" },
      { page: ["1", "2"] }, { page: "01" }, { page: true }, { userId: "other" },
    ]) expect(() => parseInquiryQuery(query)).toThrow();
  });
  it("empty mutation bodies reject arrays and extra keys", () => {
    expect(() => assertEmptyBody(undefined)).not.toThrow();
    expect(() => assertEmptyBody({})).not.toThrow();
    expect(() => assertEmptyBody([])).toThrow();
    expect(() => assertEmptyBody({ userId: "other" })).toThrow();
  });
});

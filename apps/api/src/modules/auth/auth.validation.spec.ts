import { AuthRateLimiter } from "./auth-rate-limiter.js";
import { parseEmail, parseName, parsePassword, parseStrictBody } from "./auth.validation.js";

describe("auth input bounds and throttling", () => {
  it("rejects unknown keys and invalid runtime shapes", () => {
    expect(() => parseStrictBody({ email: "test", role: "ADMIN" }, ["email"])).toThrow();
    expect(() => parseStrictBody([], ["email"])).toThrow();
    expect(() => parseStrictBody(null, [])).toThrow();
    expect(parseStrictBody({}, [])).toEqual({});
  });
  it("validates raw Unicode code points before trimming and preserves password bytes", () => {
    expect(parseName(" 😀 ")).toBe("😀");
    expect(() => parseName(" ".repeat(101))).toThrow();
    expect(parseEmail("  USER@Example.Test ")).toBe("user@example.test");
    expect(() => parseEmail(" ".repeat(321))).toThrow();
    expect(() => parseEmail(`${"İ".repeat(315)}@x.co`)).toThrow();
    const secret = "  Password#123  ";
    expect(parsePassword(secret)).toBe(secret);
    expect(() => parsePassword("😀".repeat(11))).toThrow();
    expect(parsePassword("😀".repeat(12))).toHaveLength(24);
    expect(() => parsePassword("😀".repeat(129))).toThrow();
    expect(() => parsePassword(`SafePassword#${"\ud800"}`)).toThrow();
  });
  it("rate limiter accepts limit then returns a typed 429 for same peer", () => {
    const limiter = new AuthRateLimiter();
    for (let index = 0; index < 4; index += 1) limiter.check("register", "127.0.0.1", 4);
    expect(() => limiter.check("register", "127.0.0.1", 4)).toThrow(
      expect.objectContaining({ status: 429, code: "RATE_LIMITED" }),
    );
    limiter.check("login", "127.0.0.1", 8);
  });
});

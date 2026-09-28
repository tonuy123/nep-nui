import { isWithinCodePointLimit } from "./content-length.js";

describe("isWithinCodePointLimit", () => {
  it("tinh theo code points, khong theo UTF-16 units", () => {
    const ascii = "a".repeat(10);
    expect(isWithinCodePointLimit(ascii, 10)).toBe(true);
    expect(isWithinCodePointLimit(ascii, 9)).toBe(false);

    const emoji = "😀".repeat(10);
    expect(emoji.length).toBe(20);
    expect(isWithinCodePointLimit(emoji, 10)).toBe(true);
    expect(isWithinCodePointLimit(emoji, 9)).toBe(false);
  });

  it("dung boundary exact va +1", () => {
    expect(isWithinCodePointLimit("a".repeat(20_000), 20_000)).toBe(true);
    expect(isWithinCodePointLimit("a".repeat(20_001), 20_000)).toBe(false);
    expect(isWithinCodePointLimit("😀".repeat(20_000), 20_000)).toBe(true);
    expect(isWithinCodePointLimit("😀".repeat(20_001), 20_000)).toBe(false);
  });

  it("chuoi rong va max 0", () => {
    expect(isWithinCodePointLimit("", 0)).toBe(true);
    expect(isWithinCodePointLimit("a", 0)).toBe(false);
    expect(isWithinCodePointLimit("a", -1)).toBe(false);
  });
});

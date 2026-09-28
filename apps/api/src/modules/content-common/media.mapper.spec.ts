import { isPublicUrlAllowed, toPublicMedia, type MediaRow } from "./media.mapper.js";

const cleared: MediaRow = {
  publicUrl: "https://cdn.example.test/images/a.jpg",
  alt: "Minh hoa",
  width: 1200,
  height: 800,
  attribution: "Nguon mau",
  clearance: "CLEARED",
};

describe("toPublicMedia", () => {
  it("tra DTO khi media CLEARED voi URL hop le", () => {
    expect(toPublicMedia(cleared)).toEqual({
      publicUrl: cleared.publicUrl,
      alt: cleared.alt,
      width: cleared.width,
      height: cleared.height,
      attribution: cleared.attribution,
    });
  });

  it("tra null khi thieu media hoac clearance khong dat", () => {
    expect(toPublicMedia(null)).toBeNull();
    expect(toPublicMedia(undefined)).toBeNull();
    expect(toPublicMedia({ ...cleared, clearance: "UNVERIFIED" })).toBeNull();
    expect(toPublicMedia({ ...cleared, clearance: "BLOCKED" })).toBeNull();
  });

  it("tra null khi URL khong duoc phep", () => {
    const badUrls = [
      "javascript:alert(1)",
      "data:text/html;base64,AAA",
      "ftp://example.com/file.jpg",
      "https://user:pass@example.com/file.jpg",
      "//cdn.example.com/file.jpg",
      "not-a-url",
      "",
      "https://example.com/pa th co space.jpg",
      "http://example.com/\u0000nullbyte.jpg",
    ];

    for (const publicUrl of badUrls) {
      expect(toPublicMedia({ ...cleared, publicUrl })).toBeNull();
    }
  });

  it("chap nhan site-relative path", () => {
    expect(isPublicUrlAllowed("/images/hero/a.jpg")).toBe(true);
    expect(isPublicUrlAllowed("/images\\windows\\path.jpg")).toBe(false);
  });

  it("khong tra field noi bo (source, clearance)", () => {
    const dto = toPublicMedia({ ...cleared });

    expect(dto).not.toBeNull();
    expect(Object.keys(dto ?? {}).sort()).toEqual([
      "alt",
      "attribution",
      "height",
      "publicUrl",
      "width",
    ]);
  });
});

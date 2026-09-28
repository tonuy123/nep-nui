import { PasswordService } from "./password.service.js";

describe("PasswordService Argon2 capacity", () => {
  it("does not retain a rejected dummy-hash initialization after saturation", async () => {
    const service = new PasswordService();
    // Inject the bounded-concurrency state; no mock of Argon2 itself.
    Reflect.set(service, "active", 4);
    await expect(service.verify(null, "WrongPassword#123")).rejects.toMatchObject({
      status: 429, code: "RATE_LIMITED",
    });
    Reflect.set(service, "active", 0);

    await expect(service.verify(null, "WrongPassword#123")).resolves.toBe(false);
    await expect(service.verify(null, "WrongPassword#123")).resolves.toBe(false);
  });

  it("hash and verify use real Argon2id without normalizing password", async () => {
    const service = new PasswordService();
    const password = "  Strict Password#123  ";
    const hash = await service.hash(password);
    const segments = hash.split("$");
    expect(segments[1]).toBe("argon2id");
    expect(segments[2]).toBe("v=19");
    expect(segments[3]?.split(",").sort()).toEqual(["m=65536", "p=1", "t=3"]);
    await expect(service.verify(hash, password)).resolves.toBe(true);
    await expect(service.verify(hash, password.trim())).resolves.toBe(false);
  });
});

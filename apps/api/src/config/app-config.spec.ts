import {
  ConfigurationError,
  DEFAULT_CORS_ORIGINS,
  loadAppConfig,
} from "./app-config.js";

const VALID_URL =
  "postgresql://user:pass@127.0.0.1:55432/db_test?schema=public";

describe("loadAppConfig", () => {
  it("tra config day du khi DATABASE_URL hop le", () => {
    const config = loadAppConfig({
      DATABASE_URL: VALID_URL,
      PORT: "3100",
      CORS_ORIGINS: "https://example.com, https://app.example.com",
      NODE_ENV: "test",
    });

    expect(config.databaseUrl).toBe(VALID_URL);
    expect(config.port).toBe(3100);
    expect(config.corsOrigins).toEqual([
      "https://example.com",
      "https://app.example.com",
    ]);
    expect(config.nodeEnv).toBe("test");
  });

  it("dung default port va default CORS origins khi thieu bien", () => {
    const config = loadAppConfig({ DATABASE_URL: VALID_URL });

    expect(config.port).toBe(3001);
    expect(config.corsOrigins).toEqual(DEFAULT_CORS_ORIGINS);
    expect(config.nodeEnv).toBe("development");
  });

  it("nem ConfigurationError khi thieu DATABASE_URL", () => {
    expect(() => loadAppConfig({})).toThrow(ConfigurationError);
  });

  it("nem ConfigurationError khi DATABASE_URL khong phai postgres", () => {
    expect(() =>
      loadAppConfig({ DATABASE_URL: "mysql://user:pass@localhost:3306/db" }),
    ).toThrow(ConfigurationError);
  });

  it("nem ConfigurationError khi DATABASE_URL khong parse duoc", () => {
    expect(() => loadAppConfig({ DATABASE_URL: "not-a-url" })).toThrow(
      ConfigurationError,
    );
  });

  it("nem ConfigurationError voi PORT sai", () => {
    expect(() => loadAppConfig({ DATABASE_URL: VALID_URL, PORT: "0" })).toThrow(
      ConfigurationError,
    );
    expect(() =>
      loadAppConfig({ DATABASE_URL: VALID_URL, PORT: "70000" }),
    ).toThrow(ConfigurationError);
    expect(() =>
      loadAppConfig({ DATABASE_URL: VALID_URL, PORT: "abc" }),
    ).toThrow(ConfigurationError);
  });

  it("tu choi wildcard CORS", () => {
    expect(() =>
      loadAppConfig({ DATABASE_URL: VALID_URL, CORS_ORIGINS: "*" }),
    ).toThrow(ConfigurationError);
    expect(() =>
      loadAppConfig({
        DATABASE_URL: VALID_URL,
        CORS_ORIGINS: "https://ok.example.com,*",
      }),
    ).toThrow(ConfigurationError);
  });

  it("tu choi CORS origin khong hop le", () => {
    expect(() =>
      loadAppConfig({ DATABASE_URL: VALID_URL, CORS_ORIGINS: "not-a-url" }),
    ).toThrow(ConfigurationError);
  });

  it("khong lo DATABASE_URL trong message loi", () => {
    try {
      loadAppConfig({ DATABASE_URL: "mysql://secretuser:secretpass@host/db" });
      throw new Error("expected ConfigurationError");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);
      expect((error as Error).message).not.toContain("secretpass");
    }
  });
});

import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import type { HealthResponse } from "@webdulich/contracts";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";

const UNREACHABLE_DATABASE_URL =
  "postgresql://health_check:health_check@127.0.0.1:6553/health_check_unreachable?schema=public";

const EXPECTED_CONTENT_PATHS = [
  "/destinations",
  "/destinations/{slug}",
  "/experiences",
  "/experiences/{slug}",
  "/itineraries",
  "/itineraries/{slug}",
  "/stories",
  "/stories/{slug}",
  "/guides",
  "/guides/{slug}",
];

describe("Health (e2e)", () => {
  let app: INestApplication;
  let previousDatabaseUrl: string | undefined;

  beforeAll(async () => {
    previousDatabaseUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = UNREACHABLE_DATABASE_URL;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();

    if (previousDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = previousDatabaseUrl;
    }
  });

  it("GET /api/v1/health tra 200 va dung contract", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/health")
      .expect(200);

    const body = response.body as HealthResponse;

    expect(body.status).toBe("ok");
    expect(body.service).toBe("tourism-api");
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it("content endpoint tra 503 sanitized khi DB unreachable, health van 200", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/destinations")
      .expect(503);

    expect(response.body.error.code).toBe("DATABASE_UNAVAILABLE");
    expect(typeof response.body.requestId).toBe("string");

    const serialized = JSON.stringify(response.body);
    expect(serialized).not.toContain("ECONNREFUSED");
    expect(serialized).not.toContain("postgresql://");
    expect(serialized).not.toContain("health_check");
    expect(serialized.toLowerCase()).not.toContain("stack");

    await request(app.getHttpServer()).get("/api/v1/health").expect(200);
  });

  it("OpenAPI JSON phuc vu day du 10 public path va schemas", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/openapi.json")
      .expect(200);

    const document = response.body as {
      openapi: string;
      paths: Record<string, unknown>;
      components?: { schemas?: Record<string, unknown> };
    };

    expect(document.openapi.startsWith("3.")).toBe(true);

    const allPaths = Object.keys(document.paths).map((path) =>
      path.replace("/api/v1", ""),
    );

    expect(allPaths).toContain("/health");

    const contentPaths = allPaths
      .filter((path) => /^\/(destinations|experiences|itineraries|stories|guides)(\/|$)/.test(path))
      .sort();

    expect(contentPaths).toEqual([...EXPECTED_CONTENT_PATHS].sort());

    const schemas = Object.keys(document.components?.schemas ?? {});
    expect(schemas).toContain("DestinationSummaryDto");
    expect(schemas).toContain("PaginationDto");
    expect(schemas).toContain("ApiErrorResponseDto");
  });
});

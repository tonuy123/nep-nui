import "reflect-metadata";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import yaml from "js-yaml";
import request from "supertest";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";
import { APP_CONFIG } from "../src/config/app-config.module.js";
import { PrismaService } from "../src/database/prisma.service.js";
import { seedContentFixtures } from "./fixtures/content-fixtures.js";
import {
  createTestDatabaseHarness,
  type TestDatabaseHarness,
} from "./helpers/test-db.js";

const require = createRequire(import.meta.url);

interface ValidateFunction {
  (data: unknown): boolean;
  errors?: unknown[] | null;
}

interface AjvInstance {
  compile(schema: object): ValidateFunction;
}

const Ajv2020 = require("ajv/dist/2020") as new (
  options?: Record<string, unknown>,
) => AjvInstance;

const addFormats = require("ajv-formats") as (ajv: AjvInstance) => unknown;

const SPEC_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "docs",
  "api",
  "P3_OPENAPI.yaml",
);

interface JsonSchema {
  [key: string]: unknown;
}

function loadSpec(): JsonSchema {
  return yaml.load(readFileSync(SPEC_PATH, "utf8")) as JsonSchema;
}

function resolveRef(document: JsonSchema, ref: string): JsonSchema {
  const parts = ref.replace(/^#\//, "").split("/");
  let node: unknown = document;

  for (const part of parts) {
    node = (node as Record<string, unknown>)[part];
  }

  return node as JsonSchema;
}

function deref(document: JsonSchema, schema: unknown): unknown {
  if (Array.isArray(schema)) {
    return schema.map((child) => deref(document, child));
  }

  if (schema !== null && typeof schema === "object") {
    const record = schema as Record<string, unknown>;

    if (typeof record.$ref === "string") {
      return deref(document, resolveRef(document, record.$ref));
    }

    const out: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(record)) {
      if (["description", "example", "examples", "xml"].includes(key)) {
        continue;
      }

      out[key] = deref(document, value);
    }

    return out;
  }

  return schema;
}

function responseSchema(
  document: JsonSchema,
  path: string,
  method = "get",
): JsonSchema {
  const paths = document.paths as Record<string, Record<string, unknown>>;
  const operation = paths[path]?.[method] as Record<string, unknown>;
  const responses = operation.responses as Record<string, Record<string, unknown>>;
  const ok = responses["200"] as Record<string, unknown>;
  const content = ok.content as Record<string, Record<string, unknown>>;
  const media = content["application/json"] as Record<string, unknown>;
  return deref(document, media.schema) as JsonSchema;
}

const SPEC_TO_RUNTIME: Record<string, string> = {
  DestinationDetail: "DestinationDetailDto",
  ExperienceDetail: "ExperienceDetailDto",
  ItineraryDetail: "ItineraryDetailDto",
  ItineraryDay: "ItineraryDayDto",
  StoryDetail: "StoryDetailDto",
  GuideDetail: "GuideDetailDto",
};

describe("OpenAPI contract validation (static YAML vs real HTTP)", () => {
  let harness: TestDatabaseHarness;
  let app: INestApplication | undefined;
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);

  beforeAll(async () => {
    harness = createTestDatabaseHarness({
      previousDatabaseUrl: process.env.DATABASE_URL,
    });

    try {
      await harness.resetSafe();

      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PrismaService)
        .useValue(harness.client)
        .overrideProvider(APP_CONFIG)
        .useValue(harness.appConfig)
        .compile();

      app = moduleRef.createNestApplication();
      configureApp(app);
      await app.init();

      await seedContentFixtures(harness.client);
    } catch (error) {
      if (app !== undefined) {
        await app.close();
      }
      await harness.dispose().catch(() => undefined);
      throw error;
    }
  });

  afterAll(async () => {
    if (app !== undefined) {
      await app.close();
    }

    if (harness !== undefined) {
      await harness.dispose();
    }
  });

  const server = () => {
    if (app === undefined) {
      throw new Error("app not initialized");
    }
    return request(app.getHttpServer());
  };

  const resources = [
    {
      name: "destinations",
      detailSlugs: ["fx-dest-pub", "fx-dest-cover-bad"],
    },
    {
      name: "experiences",
      detailSlugs: ["fx-exp-pub", "fx-exp-cover-unverified"],
    },
    { name: "itineraries", detailSlugs: ["fx-itin-pub"] },
    { name: "stories", detailSlugs: ["fx-story-nodest", "fx-story-with-dest"] },
    { name: "guides", detailSlugs: ["fx-guide-nodest"] },
  ] as const;

  it("payload that cua 5 list va 5 detail validate voi static YAML", async () => {
    const spec = loadSpec();

    for (const resource of resources) {
      const listResponse = await server()
        .get(`/api/v1/${resource.name}?limit=50`)
        .expect(200);
      const listSchema = responseSchema(spec, `/api/v1/${resource.name}`);
      const validateList = ajv.compile(listSchema);

      expect(validateList(listResponse.body)).toBe(true);

      for (const slug of resource.detailSlugs) {
        const detailResponse = await server()
          .get(`/api/v1/${resource.name}/${slug}`)
          .expect(200);
        const detailSchema = responseSchema(
          spec,
          `/api/v1/${resource.name}/{slug}`,
        );
        const validateDetail = ajv.compile(detailSchema);

        const valid = validateDetail(detailResponse.body);

        if (!valid) {
          throw new Error(
            `${resource.name}/${slug} invalid: ${JSON.stringify(
              validateDetail.errors?.slice(0, 3),
            )}`,
          );
        }
      }
    }
  });

  it("payload positive validate voi runtime Swagger schemas", async () => {
    const runtimeDoc = (
      await server().get("/api/v1/openapi.json").expect(200)
    ).body as JsonSchema;

    for (const resource of resources) {
      const listResponse = await server()
        .get(`/api/v1/${resource.name}?limit=50`)
        .expect(200);
      const listSchema = responseSchema(
        runtimeDoc,
        `/api/v1/${resource.name}`,
      );
      const validateList = ajv.compile(listSchema);

      expect(validateList(listResponse.body)).toBe(true);

      for (const slug of resource.detailSlugs) {
        const detailResponse = await server()
          .get(`/api/v1/${resource.name}/${slug}`)
          .expect(200);
        const detailSchema = responseSchema(
          runtimeDoc,
          `/api/v1/${resource.name}/{slug}`,
        );
        const validateDetail = ajv.compile(detailSchema);

        expect(validateDetail(detailResponse.body)).toBe(true);
      }
    }
  });

  it("paths, required, null va bounds metadata parity giua YAML va runtime", async () => {
    const spec = loadSpec();
    const runtimeDoc = (
      await server().get("/api/v1/openapi.json").expect(200)
    ).body as JsonSchema;

    const specPaths = Object.keys(spec.paths as object)
      .map((path) => path.replace("/api/v1", ""))
      .sort();
    const runtimeContentPaths = Object.keys(runtimeDoc.paths as object)
      .map((path) => path.replace("/api/v1", ""))
      .filter((path) => /^\/(destinations|experiences|itineraries|stories|guides)(\/|$)/.test(path))
      .sort();

    expect(specPaths).toEqual(runtimeContentPaths);

    const specSchemas = spec.components as {
      schemas: Record<string, JsonSchema>;
    };
    const runtimeSchemas = runtimeDoc.components as {
      schemas: Record<string, JsonSchema>;
    };

    for (const [specName, runtimeName] of Object.entries(SPEC_TO_RUNTIME)) {
      const specSchema = specSchemas.schemas[specName] as JsonSchema;
      const runtimeSchema = runtimeSchemas.schemas[runtimeName] as JsonSchema;

      const specRequired = ([...(specSchema.required as string[])]).sort();
      const runtimeRequired = ([...(runtimeSchema.required as string[])]).sort();
      expect(runtimeRequired).toEqual(specRequired);

      const specProps = specSchema.properties as Record<string, JsonSchema>;
      const runtimeProps = runtimeSchema.properties as Record<string, JsonSchema>;

      expect(Object.keys(runtimeProps).sort()).toEqual(
        Object.keys(specProps).sort(),
      );
    }

    const destinationSpecProps = (
      specSchemas.schemas.DestinationDetail as JsonSchema
    ).properties as Record<string, JsonSchema>;
    const destinationRuntimeProps = (
      runtimeSchemas.schemas.DestinationDetailDto as JsonSchema
    ).properties as Record<string, JsonSchema>;

    expect(destinationSpecProps.body?.maxLength).toBe(20_000);
    expect(destinationRuntimeProps.body?.maxLength).toBe(
      destinationSpecProps.body?.maxLength,
    );
    expect(destinationSpecProps.gallery?.maxItems).toBe(24);
    expect(destinationRuntimeProps.gallery?.maxItems).toBe(
      destinationSpecProps.gallery?.maxItems,
    );

    const itinerarySpecProps = (
      specSchemas.schemas.ItineraryDetail as JsonSchema
    ).properties as Record<string, JsonSchema>;
    const itineraryRuntimeProps = (
      runtimeSchemas.schemas.ItineraryDetailDto as JsonSchema
    ).properties as Record<string, JsonSchema>;

    expect(itinerarySpecProps.days?.maxItems).toBe(30);
    expect(itineraryRuntimeProps.days?.maxItems).toBe(
      itinerarySpecProps.days?.maxItems,
    );
    expect(itineraryRuntimeProps.body?.maxLength).toBe(20_000);

    const daySpecProps = (specSchemas.schemas.ItineraryDay as JsonSchema)
      .properties as Record<string, JsonSchema>;
    const dayRuntimeProps = (runtimeSchemas.schemas.ItineraryDayDto as JsonSchema)
      .properties as Record<string, JsonSchema>;

    expect(daySpecProps.content?.maxLength).toBe(5_000);
    expect(dayRuntimeProps.content?.maxLength).toBe(
      daySpecProps.content?.maxLength,
    );

    const runtimeDestinationListPath = (
      runtimeDoc.paths as Record<string, Record<string, unknown>>
    )["/api/v1/destinations"] as Record<string, unknown>;
    const getOperation = runtimeDestinationListPath.get as Record<string, unknown>;
    const parameters = getOperation.parameters as Array<Record<string, unknown>>;
    const limitParameter = parameters.find(
      (parameter) => parameter.name === "limit",
    ) as Record<string, JsonSchema>;

    expect(limitParameter.schema.maximum).toBe(50);
  });

  it("static contract tu choi unknown field, body oversize, days/gallery oversize", async () => {
    const spec = loadSpec();

    const destinationDetail = await server()
      .get("/api/v1/destinations/fx-dest-pub")
      .expect(200);
    const destinationDetailSchema = responseSchema(
      spec,
      "/api/v1/destinations/{slug}",
    );
    const validateDestination = ajv.compile(destinationDetailSchema);

    const destinationPayload = destinationDetail.body as {
      data: Record<string, unknown>;
    };
    const destinationData = destinationPayload.data;

    expect(
      validateDestination({
        data: { ...destinationData, unexpectedField: true },
      }),
    ).toBe(false);
    expect(
      validateDestination({
        data: { ...destinationData, body: "a".repeat(20_001) },
      }),
    ).toBe(false);

    const gallery = destinationData.gallery as unknown[];
    expect(
      validateDestination({
        data: {
          ...destinationData,
          gallery: Array.from(
            { length: 25 },
            (_, index) => gallery[index % gallery.length],
          ),
        },
      }),
    ).toBe(false);

    const itineraryDetail = await server()
      .get("/api/v1/itineraries/fx-itin-pub")
      .expect(200);
    const itineraryDetailSchema = responseSchema(
      spec,
      "/api/v1/itineraries/{slug}",
    );
    const validateItinerary = ajv.compile(itineraryDetailSchema);
    const itineraryPayload = itineraryDetail.body as { data: Record<string, unknown> };
    const days = itineraryPayload.data.days as unknown[];

    expect(
      validateItinerary({
        data: {
          ...itineraryPayload.data,
          days: Array.from({ length: 31 }, (_, index) => days[index % days.length]),
        },
      }),
    ).toBe(false);

    expect(validateItinerary(itineraryDetail.body)).toBe(true);
    expect(validateDestination(destinationDetail.body)).toBe(true);
  });
});

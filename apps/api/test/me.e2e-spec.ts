import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";
import { APP_CONFIG } from "../src/config/app-config.module.js";
import { PrismaService } from "../src/database/prisma.service.js";
import { seedContentFixtures } from "./fixtures/content-fixtures.js";
import { createTestDatabaseHarness, type TestDatabaseHarness } from "./helpers/test-db.js";

const ROOT = "/api/v1";
const ORIGIN = "http://localhost:3000";
const PASSWORD = "SecurePassword123!";
interface Session { cookies: string[]; csrf: string; userId: string }
interface PublicUser { id: string; email: string; name: string; role: string }

describe("Me account API (e2e, isolated PostgreSQL)", () => {
  let app: INestApplication | undefined;
  let harness: TestDatabaseHarness | undefined;
  let prisma: PrismaService;
  let owner: Session;
  let other: Session;
  let publishedDestinationId: string;
  let publishedItineraryId: string;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  const server = () => {
    if (!app) throw new Error("app not initialized");
    return request(app.getHttpServer());
  };
  const cookiePair = (headers: Record<string, unknown>, name: string): string => {
    const raw = headers["set-cookie"];
    const values = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
    const match = values.map((value) => String(value).split(";", 1)[0]).find((value) => value.startsWith(`${name}=`));
    if (!match) throw new Error(`Expected ${name} cookie`);
    return match;
  };
  const csrf = async () => {
    const result = await server().get(`${ROOT}/auth/csrf`).expect(200);
    return { token: result.body.csrfToken as string, cookie: cookiePair(result.headers, "wd_csrf") };
  };
  const register = async (email: string, name: string): Promise<Session> => {
    const challenge = await csrf();
    const response = await server().post(`${ROOT}/auth/register`)
      .set("Origin", ORIGIN).set("X-CSRF-Token", challenge.token).set("Cookie", challenge.cookie)
      .send({ email, name, password: PASSWORD }).expect(201);
    return {
      csrf: challenge.token, userId: (response.body.user as PublicUser).id,
      cookies: [challenge.cookie, cookiePair(response.headers, "wd_access"), cookiePair(response.headers, "wd_refresh")],
    };
  };
  const login = async (email: string, password = PASSWORD): Promise<Session> => {
    const challenge = await csrf();
    const response = await server().post(`${ROOT}/auth/login`)
      .set("Origin", ORIGIN).set("X-CSRF-Token", challenge.token).set("Cookie", challenge.cookie)
      .send({ email, password }).expect(200);
    return {
      csrf: challenge.token, userId: (response.body.user as PublicUser).id,
      cookies: [challenge.cookie, cookiePair(response.headers, "wd_access"), cookiePair(response.headers, "wd_refresh")],
    };
  };
  const get = (session: Session, path: string) => server().get(`${ROOT}${path}`).set("Cookie", session.cookies.join("; "));
  const put = (session: Session, path: string) => server().put(`${ROOT}${path}`)
    .set("Cookie", session.cookies.join("; ")).set("Origin", ORIGIN).set("X-CSRF-Token", session.csrf).send({});
  const del = (session: Session, path: string) => server().delete(`${ROOT}${path}`)
    .set("Cookie", session.cookies.join("; ")).set("Origin", ORIGIN).set("X-CSRF-Token", session.csrf).send({});
  const post = (session: Session, path: string, body: Record<string, unknown>) => server().post(`${ROOT}${path}`)
    .set("Cookie", session.cookies.join("; ")).set("Origin", ORIGIN).set("X-CSRF-Token", session.csrf).send(body);
  const patch = (session: Session, path: string, body: Record<string, unknown>) => server().patch(`${ROOT}${path}`)
    .set("Cookie", session.cookies.join("; ")).set("Origin", ORIGIN).set("X-CSRF-Token", session.csrf).send(body);

  beforeAll(async () => {
    harness = createTestDatabaseHarness({ previousDatabaseUrl });
    try {
      await harness.resetSafe();
      const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
        .overrideProvider(PrismaService).useValue(harness.client)
        .overrideProvider(APP_CONFIG).useValue(harness.appConfig).compile();
      app = moduleRef.createNestApplication();
      configureApp(app);
      await app.init();
      prisma = harness.client;
      const fixtures = await seedContentFixtures(prisma);
      publishedDestinationId = fixtures.destinations.publishedId;
      publishedItineraryId = fixtures.itineraries.publishedId;
      owner = await register("p4-owner@example.test", "Owner");
      other = await register("p4-other@example.test", "Other");
    } catch (error) {
      await app?.close().catch(() => undefined);
      await harness.dispose().catch(() => undefined);
      throw error;
    }
  });
  afterAll(async () => {
    await app?.close();
    await harness?.dispose();
  });

  it("requires active auth and CSRF, and rejects unknown profile fields and raw overlength", async () => {
    await server().get(`${ROOT}/me/favorites`).expect(401);
    await server().patch(`${ROOT}/me/profile`).set("Cookie", owner.cookies.join("; ")).send({ name: "Paw" }).expect(403);
    await patch(owner, "/me/profile", { name: "Paw", role: "ADMIN" }).expect(400);
    await patch(owner, "/me/profile", { name: " ".repeat(100) + "Paw" }).expect(400);
    const result = await patch(owner, "/me/profile", { name: " Paw " }).expect(200);
    expect(result.body.user).toMatchObject({ id: owner.userId, name: "Paw", role: "USER" });
    expect(result.body.user).not.toHaveProperty("passwordHash");
  });

  it("scopes favorites and saved itineraries to owner and published content", async () => {
    const duplicateFavorites = await Promise.all([
      put(owner, "/me/favorites/fx-dest-pub"), put(owner, "/me/favorites/fx-dest-pub"),
    ]);
    expect(duplicateFavorites.map(({ status }) => status)).toEqual([204, 204]);
    await put(owner, "/me/favorites/fx-dest-draft").expect(404);
    const duplicateSaved = await Promise.all([
      put(owner, "/me/saved-itineraries/fx-itin-pub"), put(owner, "/me/saved-itineraries/fx-itin-pub"),
    ]);
    expect(duplicateSaved.map(({ status }) => status)).toEqual([204, 204]);
    await put(owner, "/me/saved-itineraries/fx-itin-draft").expect(404);
    expect((await get(other, "/me/favorites").expect(200)).body.data).toEqual([]);
    expect((await get(other, "/me/saved-itineraries").expect(200)).body.data).toEqual([]);
    expect((await get(owner, "/me/favorites").expect(200)).body.data).toHaveLength(1);
    expect((await get(owner, "/me/saved-itineraries").expect(200)).body.data).toHaveLength(1);
    await prisma.destination.update({ where: { id: publishedDestinationId }, data: { status: "ARCHIVED" } });
    await prisma.itinerary.update({ where: { id: publishedItineraryId }, data: { status: "ARCHIVED" } });
    expect((await get(owner, "/me/favorites").expect(200)).body.data).toEqual([]);
    expect((await get(owner, "/me/saved-itineraries").expect(200)).body.data).toEqual([]);
    await del(owner, "/me/favorites/fx-dest-pub").expect(204);
    await del(owner, "/me/saved-itineraries/fx-itin-pub").expect(204);
    await del(other, "/me/favorites/fx-dest-pub").expect(204);
    await prisma.destination.update({ where: { id: publishedDestinationId }, data: { status: "PUBLISHED" } });
    await prisma.itinerary.update({ where: { id: publishedItineraryId }, data: { status: "PUBLISHED" } });
  });

  it("enforces the 50-item cap under concurrent additions", async () => {
    const now = new Date("2026-03-01T00:00:00.000Z");
    await prisma.destination.createMany({ data: Array.from({ length: 51 }, (_, index) => ({
      slug: `p4-cap-dest-${String(index).padStart(2, "0")}`, title: `Destination ${index}`, status: "PUBLISHED" as const, publishedAt: now,
    })) });
    await prisma.itinerary.createMany({ data: Array.from({ length: 51 }, (_, index) => ({
      slug: `p4-cap-itin-${String(index).padStart(2, "0")}`, title: `Itinerary ${index}`, status: "PUBLISHED" as const, publishedAt: now,
    })) });
    const destinations = await prisma.destination.findMany({ where: { slug: { startsWith: "p4-cap-dest-" } }, orderBy: { slug: "asc" }, select: { id: true } });
    const itineraries = await prisma.itinerary.findMany({ where: { slug: { startsWith: "p4-cap-itin-" } }, orderBy: { slug: "asc" }, select: { id: true } });
    await prisma.favorite.createMany({ data: destinations.slice(0, 49).map(({ id }) => ({ userId: owner.userId, destinationId: id })) });
    await prisma.savedItinerary.createMany({ data: itineraries.slice(0, 49).map(({ id }) => ({ userId: owner.userId, itineraryId: id })) });
    const favoriteResults = await Promise.all([put(owner, "/me/favorites/p4-cap-dest-49"), put(owner, "/me/favorites/p4-cap-dest-50")]);
    expect(favoriteResults.map(({ status }) => status).sort()).toEqual([204, 409]);
    const savedResults = await Promise.all([put(owner, "/me/saved-itineraries/p4-cap-itin-49"), put(owner, "/me/saved-itineraries/p4-cap-itin-50")]);
    expect(savedResults.map(({ status }) => status).sort()).toEqual([204, 409]);
    expect(await prisma.favorite.count({ where: { userId: owner.userId } })).toBe(50);
    expect(await prisma.savedItinerary.count({ where: { userId: owner.userId } })).toBe(50);
    const existing = await prisma.favorite.findFirstOrThrow({ where: { userId: owner.userId }, select: { destination: { select: { slug: true } } } });
    await put(owner, `/me/favorites/${existing.destination.slug}`).expect(204);
    expect((await get(owner, "/me/favorites").expect(200)).body.data).toHaveLength(50);
    await prisma.destination.update({ where: { id: destinations[0].id }, data: { status: "ARCHIVED" } });
    await prisma.itinerary.update({ where: { id: itineraries[0].id }, data: { status: "ARCHIVED" } });
    expect((await get(owner, "/me/favorites").expect(200)).body.data).toHaveLength(49);
    expect((await get(owner, "/me/saved-itineraries").expect(200)).body.data).toHaveLength(49);
    const freshDestination = await prisma.destination.create({ data: {
      slug: "p4-cap-dest-fresh", title: "Fresh Destination", status: "PUBLISHED", publishedAt: now,
    } });
    const freshItinerary = await prisma.itinerary.create({ data: {
      slug: "p4-cap-itin-fresh", title: "Fresh Itinerary", status: "PUBLISHED", publishedAt: now,
    } });
    await put(owner, `/me/favorites/${freshDestination.slug}`).expect(204);
    await put(owner, `/me/saved-itineraries/${freshItinerary.slug}`).expect(204);
    expect(await prisma.favorite.count({ where: { userId: owner.userId } })).toBe(50);
    expect(await prisma.savedItinerary.count({ where: { userId: owner.userId } })).toBe(50);
    expect((await get(owner, "/me/favorites").expect(200)).body.data).toHaveLength(50);
    expect((await get(owner, "/me/saved-itineraries").expect(200)).body.data).toHaveLength(50);
  });

  it("keeps inquiry history private, paginated, and hides an archived destination reference", async () => {
    await post(owner, "/me/inquiries", { subject: "Ask", message: "Help", destinationSlug: "fx-dest-draft" }).expect(404);
    await post(owner, "/me/inquiries", { subject: "A", message: " ".repeat(2000) + "Help" }).expect(400);
    const created = await post(owner, "/me/inquiries", { subject: " Ask ", message: " Help ", destinationSlug: "fx-dest-pub" }).expect(201);
    expect(created.body.inquiry).toMatchObject({ subject: "Ask", message: "Help", status: "NEW", destination: { slug: "fx-dest-pub" } });
    expect((await get(other, "/me/inquiries").expect(200)).body.data).toEqual([]);
    const list = await get(owner, "/me/inquiries?page=1&limit=1").expect(200);
    expect(list.body.pagination).toEqual({ page: 1, limit: 1, hasMore: false });
    expect(list.body.data).toHaveLength(1);
    await prisma.destination.update({ where: { id: publishedDestinationId }, data: { status: "ARCHIVED" } });
    expect((await get(owner, "/me/inquiries").expect(200)).body.data[0].destination).toBeNull();
    await prisma.destination.update({ where: { id: publishedDestinationId }, data: { status: "PUBLISHED" } });
    for (const query of ["?page=0", "?page=01", "?page=1&page=2", "?limit=51", "?page=202&limit=50", "?userId=other"]) {
      await get(owner, `/me/inquiries${query}`).expect(400);
    }
    await post(owner, "/me/inquiries", { subject: "Second", message: "More details" }).expect(201);
    await post(owner, "/me/inquiries", { subject: "Third", message: "More details" }).expect(201);
    await post(owner, "/me/inquiries", { subject: "Over limit", message: "More details" }).expect(429);
    await post(other, "/me/inquiries", { subject: "Other traveler", message: "Independent limit" }).expect(201);
  });

  it("enforces session ownership and revokes every owner session on password change", async () => {
    const second = await login("p4-owner@example.test");
    const sessions = await get(owner, "/me/sessions").expect(200);
    expect(sessions.body.data).toHaveLength(2);
    const secondId = (sessions.body.data as Array<{ id: string; current: boolean }>).find((row) => !row.current)?.id;
    expect(secondId).toBeDefined();
    await del(other, `/me/sessions/${secondId}`).expect(404);
    await del(owner, "/me/sessions/not-a-uuid").expect(400);
    await del(owner, `/me/sessions/${secondId}`).expect(204);
    await get(second, "/me/sessions").expect(401);
    const third = await login("p4-owner@example.test");
    await post(owner, "/me/change-password", { currentPassword: "WrongPassword123!", newPassword: "NewPassword123!" }).expect(401);
    const changed = await post(owner, "/me/change-password", { currentPassword: PASSWORD, newPassword: "NewPassword123!" }).expect(204);
    expect(String(changed.headers["set-cookie"])).toContain("wd_access=");
    await get(owner, "/me/sessions").expect(401);
    await get(third, "/me/sessions").expect(401);
    await get(other, "/me/sessions").expect(200);
    const fresh = await login("p4-owner@example.test", "NewPassword123!");
    const freshSessions = await get(fresh, "/me/sessions").expect(200);
    const currentId = (freshSessions.body.data as Array<{ id: string; current: boolean }>).find((row) => row.current)?.id;
    expect(currentId).toBeDefined();
    const selfRevoked = await del(fresh, `/me/sessions/${currentId}`).expect(204);
    expect(String(selfRevoked.headers["set-cookie"])).toContain("wd_access=");
    await get(fresh, "/me/sessions").expect(401);
  });
});

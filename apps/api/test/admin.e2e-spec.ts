import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import type { Response } from "supertest";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";
import { APP_CONFIG } from "../src/config/app-config.module.js";
import { PrismaService } from "../src/database/prisma.service.js";
import type { UserRole } from "@webdulich/contracts";
import { createTestDatabaseHarness, type TestDatabaseHarness } from "./helpers/test-db.js";

const ORIGIN = "http://localhost:3000";
const PASSWORD = "VungSauXa#2026";
let phoneSequence = 0;
const testPhone = () => `09${String(40_000_000 + (phoneSequence++)).slice(-8)}`;

function cookies(response: Response): string[] {
  const header = response.headers["set-cookie"] as string[] | string | undefined;
  return Array.isArray(header) ? header : header ? [header] : [];
}

function cookieHeader(response: Response): string {
  return cookies(response).map((line) => line.split(";")[0]).join("; ");
}

describe("P5 admin CMS HTTP, real PostgreSQL", () => {
  let harness: TestDatabaseHarness;
  let app: INestApplication;
  const api = () => request(app.getHttpServer());

  beforeAll(() => {
    harness = createTestDatabaseHarness({ previousDatabaseUrl: process.env.DATABASE_URL });
  });

  beforeEach(async () => {
    try {
      await harness.resetSafe();
      const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
        .overrideProvider(PrismaService).useValue(harness.client)
        .overrideProvider(APP_CONFIG).useValue(harness.appConfig).compile();
      app = moduleRef.createNestApplication();
      configureApp(app);
      await app.init();
    } catch (error) {
      if (app) await app.close();
      throw error;
    }
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  afterAll(async () => {
    if (harness) await harness.dispose();
  });

  async function csrf() {
    const response = await api().get("/api/v1/auth/csrf").expect(200);
    return { token: response.body.csrfToken as string, cookie: cookieHeader(response) };
  }

  async function register(email: string): Promise<string> {
    const stamp = await csrf();
    const response = await api()
      .post("/api/v1/auth/register")
      .set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token)
      .set("Cookie", stamp.cookie)
      .send({ name: "Nguoi dung test", email, phone: testPhone(), password: PASSWORD })
      .expect(201);
    return cookieHeader(response);
  }

  async function session(email: string): Promise<string> {
    const stamp = await csrf();
    const response = await api()
      .post("/api/v1/auth/login")
      .set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token)
      .set("Cookie", stamp.cookie)
      .send({ email, password: PASSWORD })
      .expect(200);
    return cookieHeader(response);
  }

  async function promote(email: string, role: UserRole): Promise<string> {
    const user = await harness.client.user.update({ where: { email }, data: { role } });
    return user.id;
  }

  async function get(url: string, sessionCookie: string): Promise<Response> {
    return api().get(url).set("Cookie", sessionCookie);
  }

  async function mutate(
    method: "post" | "patch" | "put" | "delete",
    url: string,
    sessionCookie: string,
    body?: object,
  ): Promise<Response> {
    const stamp = await csrf();
    const cookie = `${sessionCookie}; ${stamp.cookie}`;
    const base = api()[method](url).set("Origin", ORIGIN).set("Cookie", cookie).set("X-CSRF-Token", stamp.token);
    return body === undefined ? base : base.send(body);
  }

  async function editorSession(email = "editor@example.test"): Promise<string> {
    await register(email);
    await promote(email, "EDITOR");
    return session(email);
  }

  async function adminSession(email = "admin@example.test"): Promise<string> {
    await register(email);
    await promote(email, "ADMIN");
    return session(email);
  }

  const destinationBody = {
    slug: "sa-pa-test",
    title: "Sa Pa",
    excerpt: "Thị trấn trong sương",
    body: "Nội dung biên tập về Sa Pa.",
  };

  it("denies USER on admin surfaces and rejects unknown resources", async () => {
    const user = await register("user@example.test");

    expect((await get("/api/v1/admin/overview", user)).status).toBe(403);
    expect((await get("/api/v1/admin/content/destinations", user)).status).toBe(403);
    expect((await mutate("post", "/api/v1/admin/content/destinations", user, destinationBody)).status).toBe(403);
    expect((await get("/api/v1/admin/media", user)).status).toBe(403);
    expect((await get("/api/v1/admin/inquiries", user)).status).toBe(403);

    const editor = await editorSession();
    const unknown = await get("/api/v1/admin/content/pois", editor);
    expect(unknown.status).toBe(400);
    expect(unknown.body.error.code).toBe("INVALID_QUERY");
    expect((await get("/api/v1/admin/users", editor)).status).toBe(403);
    expect((await get("/api/v1/admin/audit-logs", editor)).status).toBe(403);
  });

  it("runs the destination lifecycle with audit entries and public visibility", async () => {
    const editor = await editorSession();

    const created = await mutate("post", "/api/v1/admin/content/destinations", editor, destinationBody);
    expect(created.status).toBe(201);
    const id = created.body.data.id as string;
    expect(created.body.data.status).toBe("DRAFT");
    expect(created.body.data.slug).toBe("sa-pa-test");

    const duplicate = await mutate("post", "/api/v1/admin/content/destinations", editor, {
      ...destinationBody,
      title: "Sa Pa 2",
    });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe("SLUG_TAKEN");

    const list = await get("/api/v1/admin/content/destinations", editor);
    expect(list.status).toBe(200);
    expect(list.body.pagination).toMatchObject({ page: 1, limit: 20, total: 1, hasMore: false });

    const published = await mutate("post", `/api/v1/admin/content/destinations/${id}/publish`, editor);
    expect(published.status).toBe(201);
    expect(published.body.data.status).toBe("PUBLISHED");
    expect(published.body.data.publishedAt).not.toBeNull();

    const publicList = await api().get("/api/v1/destinations").expect(200);
    expect(publicList.body.data.map((row: { slug: string }) => row.slug)).toEqual(["sa-pa-test"]);

    const slugLock = await mutate("patch", `/api/v1/admin/content/destinations/${id}`, editor, { slug: "sa-pa-moi" });
    expect(slugLock.status).toBe(409);
    expect(slugLock.body.error.code).toBe("CONTENT_LOCKED");

    const titleEdit = await mutate("patch", `/api/v1/admin/content/destinations/${id}`, editor, { title: "Sa Pa mù sương" });
    expect(titleEdit.status).toBe(200);
    expect(titleEdit.body.data.title).toBe("Sa Pa mù sương");

    const removePublished = await mutate("delete", `/api/v1/admin/content/destinations/${id}`, editor);
    expect(removePublished.status).toBe(409);
    expect(removePublished.body.error.code).toBe("CONTENT_LOCKED");

    const archived = await mutate("post", `/api/v1/admin/content/destinations/${id}/archive`, editor);
    expect(archived.status).toBe(201);
    expect(archived.body.data.status).toBe("ARCHIVED");
    expect((await api().get("/api/v1/destinations").expect(200)).body.data).toEqual([]);

    const restored = await mutate("post", `/api/v1/admin/content/destinations/${id}/restore`, editor);
    expect(restored.status).toBe(201);
    expect(restored.body.data.status).toBe("DRAFT");

    const deleted = await mutate("delete", `/api/v1/admin/content/destinations/${id}`, editor);
    expect(deleted.status).toBe(204);
    expect((await get("/api/v1/admin/content/destinations", editor)).body.pagination.total).toBe(0);
  });

  it("enforces publication requirements and destination dependencies", async () => {
    const editor = await editorSession();

    const bare = await mutate("post", "/api/v1/admin/content/destinations", editor, {
      slug: "thieu-noi-dung",
      title: "Thiếu nội dung",
    });
    const bareId = bare.body.data.id as string;
    const notAllowed = await mutate("post", `/api/v1/admin/content/destinations/${bareId}/publish`, editor);
    expect(notAllowed.status).toBe(422);
    expect(notAllowed.body.error.code).toBe("PUBLICATION_NOT_ALLOWED");
    expect(notAllowed.body.error.details.map((detail: { field: string }) => detail.field)).toEqual(
      expect.arrayContaining(["excerpt", "body"]),
    );

    const draftDestination = await mutate("post", "/api/v1/admin/content/destinations", editor, {
      ...destinationBody,
      slug: "draft-dest",
      title: "Điểm đến nháp",
    });
    const draftId = draftDestination.body.data.id as string;

    const experience = await mutate("post", "/api/v1/admin/content/experiences", editor, {
      slug: "trekking-test",
      title: "Trekking",
      excerpt: "Đi bộ đường dài",
      body: "Nội dung trải nghiệm.",
      destinationId: draftId,
    });
    const experienceId = experience.body.data.id as string;

    const refused = await mutate("post", `/api/v1/admin/content/experiences/${experienceId}/publish`, editor);
    expect(refused.status).toBe(422);
    expect(refused.body.error.details[0].field).toBe("destinationId");

    await mutate("post", `/api/v1/admin/content/destinations/${draftId}/publish`, editor);
    const published = await mutate("post", `/api/v1/admin/content/experiences/${experienceId}/publish`, editor);
    expect(published.status).toBe(201);
    expect(published.body.data.status).toBe("PUBLISHED");

    await mutate("post", `/api/v1/admin/content/destinations/${draftId}/archive`, editor);
    const inUse = await mutate("delete", `/api/v1/admin/content/destinations/${draftId}`, editor);
    expect(inUse.status).toBe(409);
    expect(inUse.body.error.code).toBe("CONTENT_IN_USE");

    const itinerary = await mutate("post", "/api/v1/admin/content/itineraries", editor, {
      slug: "ba-ngay-test",
      title: "Ba ngày Tây Bắc",
      excerpt: "Lịch trình ngắn",
      body: "Nội dung hành trình.",
      days: [
        { title: "Ngày 1", content: "Khởi hành", destinationId: draftId },
        { title: "Ngày 2", content: "Trekking" },
      ],
    });
    expect(itinerary.status).toBe(201);
    expect(itinerary.body.data.days).toHaveLength(2);
    expect(itinerary.body.data.days[0].dayNumber).toBe(1);
    expect(itinerary.body.data.days[0].destination.slug).toBe("draft-dest");

    const invalidDays = await mutate("patch", `/api/v1/admin/content/itineraries/${itinerary.body.data.id}`, editor, {
      days: [{ content: "  " }],
    });
    expect(invalidDays.status).toBe(400);
  });

  it("guards media usage and tracks clearance", async () => {
    const editor = await editorSession();

    const media = await mutate("post", "/api/v1/admin/media", editor, {
      publicUrl: "/images/destinations/sa-pa.webp",
      alt: "Ruộng bậc thang Sa Pa",
      width: 1200,
      height: 900,
      clearance: "CLEARED",
    });
    expect(media.status).toBe(201);
    expect(media.body.data.usageCount).toBe(0);
    const mediaId = media.body.data.id as string;

    const badUrl = await mutate("post", "/api/v1/admin/media", editor, {
      publicUrl: "javascript:alert(1)",
      alt: "x",
      width: 10,
      height: 10,
    });
    expect(badUrl.status).toBe(400);

    const destination = await mutate("post", "/api/v1/admin/content/destinations", editor, {
      ...destinationBody,
      slug: "media-dest",
      title: "Điểm đến có ảnh",
      coverMediaId: mediaId,
      galleryMediaIds: [mediaId],
    });
    const destinationId = destination.body.data.id as string;
    expect(destination.body.data.coverMedia.id).toBe(mediaId);
    expect(destination.body.data.gallery).toEqual([
      expect.objectContaining({ position: 0, media: expect.objectContaining({ id: mediaId }) }),
    ]);

    const list = await get("/api/v1/admin/media?clearance=CLEARED", editor);
    expect(list.body.data[0].usageCount).toBe(2);

    const blockedDelete = await mutate("delete", `/api/v1/admin/media/${mediaId}`, editor);
    expect(blockedDelete.status).toBe(409);
    expect(blockedDelete.body.error.code).toBe("MEDIA_IN_USE");

    await mutate("patch", `/api/v1/admin/content/destinations/${destinationId}`, editor, {
      coverMediaId: null,
      galleryMediaIds: [],
    });
    expect((await mutate("delete", `/api/v1/admin/media/${mediaId}`, editor)).status).toBe(204);
  });

  it("processes the inquiry inbox", async () => {
    const user = await register("visitor@example.test");
    const created = await mutate("post", "/api/v1/me/inquiries", user, {
      subject: "Tư vấn Mù Cang Chải",
      message: "Tôi muốn đi vào tháng 9, cần thông tin đường đi.",
    });
    expect(created.status).toBe(201);
    const inquiryId = created.body.inquiry.id as string;

    const editor = await editorSession();
    const inbox = await get("/api/v1/admin/inquiries?status=NEW", editor);
    expect(inbox.status).toBe(200);
    expect(inbox.body.pagination.total).toBe(1);
    expect(inbox.body.data[0]).toMatchObject({
      id: inquiryId,
      subject: "Tư vấn Mù Cang Chải",
      status: "NEW",
      handledAt: null,
      user: { email: "visitor@example.test" },
    });

    const updated = await mutate("patch", `/api/v1/admin/inquiries/${inquiryId}`, editor, {
      status: "IN_PROGRESS",
      adminNote: "Đã gọi tư vấn",
    });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe("IN_PROGRESS");
    expect(updated.body.data.adminNote).toBe("Đã gọi tư vấn");
    expect(updated.body.data.handledAt).not.toBeNull();

    const invalid = await mutate("patch", `/api/v1/admin/inquiries/${inquiryId}`, editor, { status: "DONE" });
    expect(invalid.status).toBe(400);
  });

  it("manages users under ADMIN rules", async () => {
    const admin = await adminSession("root@example.test");
    await register("second-admin@example.test");
    const secondAdminId = await promote("second-admin@example.test", "ADMIN");
    await register("member@example.test");
    const memberId = await promote("member@example.test", "USER");

    const list = await get("/api/v1/admin/users?q=member", admin);
    expect(list.status).toBe(200);
    expect(list.body.pagination.total).toBe(1);
    expect(list.body.data[0]).toMatchObject({ id: memberId, role: "USER", status: "ACTIVE" });

    const self = await mutate("patch", `/api/v1/admin/users/${(await harness.client.user.findUniqueOrThrow({ where: { email: "root@example.test" } })).id}`, admin, {
      status: "DISABLED",
    });
    expect(self.status).toBe(409);
    expect(self.body.error.code).toBe("USER_SELF_UPDATE");

    const promoted = await mutate("patch", `/api/v1/admin/users/${memberId}`, admin, { role: "EDITOR" });
    expect(promoted.status).toBe(200);
    expect(promoted.body.data.role).toBe("EDITOR");

    const disabled = await mutate("patch", `/api/v1/admin/users/${memberId}`, admin, { status: "DISABLED" });
    expect(disabled.status).toBe(200);
    expect(disabled.body.data.status).toBe("DISABLED");

    const loginAttempt = await (async () => {
      const stamp = await csrf();
      return api()
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN)
        .set("X-CSRF-Token", stamp.token)
        .set("Cookie", stamp.cookie)
        .send({ email: "member@example.test", password: PASSWORD });
    })();
    expect(loginAttempt.status).toBe(401);

    const demoted = await mutate("patch", `/api/v1/admin/users/${secondAdminId}`, admin, { role: "EDITOR" });
    expect(demoted.status).toBe(200);
    expect(demoted.body.data.role).toBe("EDITOR");

    const missing = await mutate("patch", "/api/v1/admin/users/0f9a1f16-4a2d-4a3f-9d0e-6a2b1c3d4e5f", admin, { role: "EDITOR" });
    expect(missing.status).toBe(404);
  });

  it("records privileged actions in an ADMIN-only audit log", async () => {
    const editor = await editorSession();
    await mutate("post", "/api/v1/admin/content/destinations", editor, destinationBody);

    const admin = await adminSession("audit-admin@example.test");
    const logs = await get("/api/v1/admin/audit-logs?resource=destination", admin);
    expect(logs.status).toBe(200);
    expect(logs.body.pagination.total).toBe(1);
    expect(logs.body.data[0]).toMatchObject({
      action: "content.create",
      resource: "destination",
      actorEmail: "editor@example.test",
    });
    expect(logs.body.data[0].summary).toContain("Sa Pa");

    const filterUnknown = await get("/api/v1/admin/audit-logs?resource=" + "x".repeat(31), admin);
    expect(filterUnknown.status).toBe(400);

    const overview = await get("/api/v1/admin/overview", editor);
    expect(overview.status).toBe(200);
    expect(overview.body.data.content.destinations.DRAFT).toBe(1);
    expect(overview.body.data.media).toEqual({ UNVERIFIED: 0, CLEARED: 0, BLOCKED: 0 });
    expect(overview.body.data.recentAudit[0].action).toBe("content.create");

    const options = await get("/api/v1/admin/options", editor);
    expect(options.status).toBe(200);
    expect(options.body.data.destinations).toHaveLength(1);
  });
});

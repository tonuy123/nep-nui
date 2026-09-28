import { HealthService } from "./health.service.js";

describe("HealthService", () => {
  it("tra ve status ok, dung service name va timestamp ISO-8601", () => {
    const service = new HealthService();
    const result = service.getHealth();

    expect(result.status).toBe("ok");
    expect(result.service).toBe("tourism-api");
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});

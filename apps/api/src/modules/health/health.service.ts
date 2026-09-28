import { Injectable } from "@nestjs/common";
import type { HealthResponse } from "@webdulich/contracts";

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "tourism-api",
      timestamp: new Date().toISOString(),
    };
  }
}

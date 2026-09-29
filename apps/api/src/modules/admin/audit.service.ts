import { Injectable } from "@nestjs/common";
import type { AuthPrincipal } from "../auth/auth.types.js";
import type { Db } from "./admin-content.repository.js";

export interface AuditEntry {
  action: string;
  resource: string;
  resourceId: string | null;
  summary: string;
}

@Injectable()
export class AuditService {
  record(db: Db, principal: AuthPrincipal, entry: AuditEntry): Promise<{ id: string }> {
    return db.auditLog.create({
      data: {
        actorId: principal.userId,
        actorName: principal.user.name,
        actorEmail: principal.user.email,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        summary: entry.summary.slice(0, 500),
      },
      select: { id: true },
    });
  }
}

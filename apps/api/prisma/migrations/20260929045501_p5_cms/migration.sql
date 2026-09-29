-- AlterTable
ALTER TABLE "inquiries" ADD COLUMN     "adminNote" VARCHAR(1000),
ADD COLUMN     "handledAt" TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "actorName" VARCHAR(100) NOT NULL,
    "actorEmail" VARCHAR(320) NOT NULL,
    "action" VARCHAR(60) NOT NULL,
    "resource" VARCHAR(30) NOT NULL,
    "resourceId" UUID,
    "summary" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_id_idx" ON "audit_logs"("createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_resource_resourceId_idx" ON "audit_logs"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "inquiries_status_createdAt_id_idx" ON "inquiries"("status", "createdAt" DESC, "id" DESC);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

BEGIN;
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accessTokenHash" CHAR(64) NOT NULL,
    "accessExpiresAt" TIMESTAMPTZ(3) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_refresh_tokens" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "destinationId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_itineraries" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "itineraryId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "destinationId" UUID,
    "subject" VARCHAR(160) NOT NULL,
    "message" VARCHAR(2000) NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_accessTokenHash_key" ON "auth_sessions"("accessTokenHash");

-- CreateIndex
CREATE INDEX "auth_sessions_userId_createdAt_id_idx" ON "auth_sessions"("userId", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "auth_sessions_expiresAt_idx" ON "auth_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "auth_refresh_tokens_tokenHash_key" ON "auth_refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "auth_refresh_tokens_sessionId_idx" ON "auth_refresh_tokens"("sessionId");

-- CreateIndex
CREATE INDEX "auth_refresh_tokens_expiresAt_idx" ON "auth_refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "favorites_userId_createdAt_id_idx" ON "favorites"("userId", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "favorites_destinationId_idx" ON "favorites"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_destinationId_key" ON "favorites"("userId", "destinationId");

-- CreateIndex
CREATE INDEX "saved_itineraries_userId_createdAt_id_idx" ON "saved_itineraries"("userId", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "saved_itineraries_itineraryId_idx" ON "saved_itineraries"("itineraryId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_itineraries_userId_itineraryId_key" ON "saved_itineraries"("userId", "itineraryId");

-- CreateIndex
CREATE INDEX "inquiries_userId_createdAt_id_idx" ON "inquiries"("userId", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "inquiries_destinationId_idx" ON "inquiries"("destinationId");

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "auth_refresh_tokens" ADD CONSTRAINT "auth_refresh_tokens_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "auth_sessions"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "saved_itineraries" ADD CONSTRAINT "saved_itineraries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "saved_itineraries" ADD CONSTRAINT "saved_itineraries_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Bound persisted auth/account data. Existing P3 content tables remain untouched.
ALTER TABLE "users" ADD CONSTRAINT "users_name_bounds_check" CHECK (char_length("name") BETWEEN 1 AND 100 AND btrim("name") <> '');
ALTER TABLE "users" ADD CONSTRAINT "users_email_normalized_check" CHECK ("email" = lower(btrim("email")) AND char_length("email") BETWEEN 3 AND 320);
ALTER TABLE "users" ADD CONSTRAINT "users_password_hash_check" CHECK (left("passwordHash", 10) = '$argon2id$');
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_expiry_check" CHECK ("accessExpiresAt" > "createdAt" AND "expiresAt" >= "accessExpiresAt");
ALTER TABLE "auth_refresh_tokens" ADD CONSTRAINT "auth_refresh_tokens_expiry_check" CHECK ("expiresAt" > "createdAt");
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_subject_bounds_check" CHECK (char_length("subject") BETWEEN 1 AND 160 AND btrim("subject") <> '');
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_message_bounds_check" CHECK (char_length("message") BETWEEN 1 AND 2000 AND btrim("message") <> '');
COMMIT;

import type { PrismaService } from "../../database/prisma.service.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ContentApiError } from "../content-common/errors.js";
import { isRetryableTransactionError } from "../content-common/transaction-errors.js";

export const COLLECTION_LIMIT = 50;

export async function accountTransaction<T>(
  prisma: PrismaService,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  retryUnique = false,
): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (!isRetryableTransactionError(error, retryUnique)) throw error;
    }
  }
  throw new ContentApiError(409, "ACCOUNT_CONFLICT", "Account change conflicted. Try again.");
}

export async function requireActiveUser(tx: Prisma.TransactionClient, userId: string): Promise<void> {
  const user = await tx.user.findFirst({ where: { id: userId, status: "ACTIVE" }, select: { id: true } });
  if (!user) throw new ContentApiError(401, "UNAUTHENTICATED", "Authentication required.");
}

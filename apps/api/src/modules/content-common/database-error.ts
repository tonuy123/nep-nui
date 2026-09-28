const DATABASE_UNAVAILABLE_NAMES: ReadonlySet<string> = new Set([
  "PrismaClientInitializationError",
]);

const DATABASE_UNAVAILABLE_CODES: ReadonlySet<string> = new Set([
  // Prisma known request errors
  "P1000",
  "P1001",
  "P1002",
  "P1003",
  "P1008",
  "P1010",
  "P1017",
  "P2024",
  "P2037",
  // node-postgres / libpq SQLSTATEs
  "08000",
  "08001",
  "08003",
  "08004",
  "08006",
  "08007",
  "53300",
  "57P01",
  "57P02",
  "57P03",
  // network layer
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EPIPE",
  "ETIMEDOUT",
]);

const MAX_SCAN_DEPTH = 6;

/**
 * Prisma 7 driver adapters bọc SQLSTATE gốc trong
 * meta.driverAdapterError.cause.originalCode. Classifier chỉ đọc các field
 * đã biết (name/code/originalCode/cause/meta.driverAdapterError) và chỉ
 * classify khi khớp whitelist availability; không match message, không
 * quét arbitrary property, không suy luận từ kind.
 */
export function isDatabaseUnavailableError(error: unknown): boolean {
  return scanForAvailability(error, new Set<object>(), 0);
}

function scanForAvailability(
  value: unknown,
  visited: Set<object>,
  depth: number,
): boolean {
  if (depth > MAX_SCAN_DEPTH || value === null || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  if (visited.has(record)) {
    return false;
  }

  visited.add(record);

  if (
    typeof record.name === "string" &&
    DATABASE_UNAVAILABLE_NAMES.has(record.name)
  ) {
    return true;
  }

  if (
    typeof record.code === "string" &&
    DATABASE_UNAVAILABLE_CODES.has(record.code)
  ) {
    return true;
  }

  if (
    typeof record.originalCode === "string" &&
    DATABASE_UNAVAILABLE_CODES.has(record.originalCode)
  ) {
    return true;
  }

  const meta = record.meta;

  if (meta !== null && typeof meta === "object") {
    const driverAdapterError = (meta as Record<string, unknown>)
      .driverAdapterError;

    if (
      driverAdapterError !== null &&
      driverAdapterError !== undefined &&
      typeof driverAdapterError === "object" &&
      scanForAvailability(driverAdapterError, visited, depth + 1)
    ) {
      return true;
    }
  }

  const cause = record.cause;

  if (cause !== undefined && cause !== record) {
    return scanForAvailability(cause, visited, depth + 1);
  }

  return false;
}

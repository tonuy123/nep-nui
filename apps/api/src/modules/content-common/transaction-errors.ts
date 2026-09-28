const MAX_ERROR_DEPTH = 6;

export function hasDatabaseErrorCode(error: unknown, codes: readonly string[]): boolean {
  const visited = new Set<object>();
  const scan = (value: unknown, depth: number): boolean => {
    if (depth > MAX_ERROR_DEPTH || value === null || typeof value !== "object" || visited.has(value)) return false;
    visited.add(value);
    const record = value as Record<string, unknown>;
    if (typeof record.code === "string" && codes.includes(record.code)) return true;
    if (typeof record.originalCode === "string" && codes.includes(record.originalCode)) return true;
    const adapter = record.meta && typeof record.meta === "object"
      ? (record.meta as Record<string, unknown>).driverAdapterError : undefined;
    return scan(record.cause, depth + 1) || scan(adapter, depth + 1);
  };
  return scan(error, 0);
}

export function isRetryableTransactionError(error: unknown, retryUnique: boolean): boolean {
  const retryCodes = retryUnique
    ? ["P2034", "40001", "40P01", "P2002", "23505"]
    : ["P2034", "40001", "40P01"];
  return hasDatabaseErrorCode(error, retryCodes);
}

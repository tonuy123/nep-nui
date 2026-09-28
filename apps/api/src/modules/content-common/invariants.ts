import { InternalError } from "./errors.js";

export function requirePublishedAt(value: Date | null): Date {
  if (!value) {
    throw new InternalError();
  }

  return value;
}

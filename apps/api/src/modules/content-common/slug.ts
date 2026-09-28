import { ValidationError } from "./errors.js";

export const SLUG_MAX_LENGTH = 120;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(value: string): boolean {
  return (
    value.length > 0 && value.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(value)
  );
}

export function assertSlugParam(value: unknown): string {
  if (typeof value !== "string" || !isValidSlug(value)) {
    throw new ValidationError([
      {
        field: "slug",
        message:
          "Slug must be ASCII kebab-case (lowercase letters, digits, hyphens), max 120 characters.",
      },
    ]);
  }

  return value;
}

import { ContentApiError } from "../content-common/errors.js";

export class AuthError extends ContentApiError {}
export function unauthenticated(): AuthError {
  return new AuthError(401, "UNAUTHENTICATED", "Authentication required.");
}
export function invalidBody(): AuthError {
  return new AuthError(400, "INVALID_BODY", "Invalid request body.");
}

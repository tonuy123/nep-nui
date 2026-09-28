export type UserRole = "USER" | "EDITOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "DISABLED";
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}
export interface AuthResponse { user: PublicUser }
export interface CsrfResponse { csrfToken: string }

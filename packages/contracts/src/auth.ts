export type UserRole = "USER" | "EDITOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "DISABLED";
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  province: string | null;
  ward: string | null;
  role: UserRole;
  createdAt: string;
}
export interface AuthResponse { user: PublicUser }
export interface CsrfResponse { csrfToken: string }
export interface AuthConfigResponse {
  providers: { google: boolean; facebook: boolean };
  captchaSiteKey: string | null;
}

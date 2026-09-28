import type { PublicUser, UserRole } from "@webdulich/contracts";

export function mapPublicUser(user: {
  id: string; email: string; name: string; role: UserRole; createdAt: Date;
}): PublicUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt.toISOString() };
}

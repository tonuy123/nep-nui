import type { PublicUser, UserRole } from "@webdulich/contracts";

export function mapPublicUser(user: {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  province: string | null;
  ward: string | null;
  role: UserRole;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    province: user.province,
    ward: user.ward,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

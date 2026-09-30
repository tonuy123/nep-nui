import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PasswordService } from "../src/modules/auth/password.service.js";
import { parseEmail, parseName, parsePassword } from "../src/modules/auth/auth.validation.js";
import { isWithinCodePointLimit } from "../src/modules/content-common/content-length.js";

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const rawEmail = process.env.ADMIN_EMAIL;
  const rawName = process.env.ADMIN_NAME;
  const rawPassword = process.env.ADMIN_PASSWORD;
  if (!databaseUrl || !rawEmail || !rawName || !rawPassword) throw new Error("missing-input");
  const email = parseEmail(rawEmail);
  const name = parseName(rawName);
  const password = parsePassword(rawPassword);
  if (isWithinCodePointLimit(password, 15) || !/[a-z]/.test(password) || !/[A-Z]/.test(password)
    || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) throw new Error("weak-password");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl, connectionTimeoutMillis: 3000, max: 2 }) });
  try {
    if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) throw new Error("existing-user");
    const passwordHash = await new PasswordService().hash(password);
    await prisma.user.create({ data: { email, name, passwordHash, role: "ADMIN", status: "ACTIVE" } });
    console.log("Admin account created.");
  } finally {
    await prisma.$disconnect();
  }
}
main().catch((error: unknown) => {
  const reason = error instanceof Error ? error.message : "";
  if (reason === "missing-input") {
    console.error("Admin bootstrap failed: thieu DATABASE_URL / ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD trong bien moi truong.");
  } else if (reason === "weak-password") {
    console.error("Admin bootstrap failed: mat khau qua yeu. Can >= 16 ky tu, gom chu thuong, chu hoa, so va ky tu dac biet (vi du: NepNui@TayBac2026!).");
  } else if (reason === "existing-user") {
    console.error("Admin bootstrap failed: email nay da co tai khoan. Dung email khac, hoac dang nhap bang tai khoan hien co.");
  } else {
    console.error("Admin bootstrap failed. Check explicit inputs, uniqueness, migration, and database availability.");
  }
  process.exitCode = 1;
});

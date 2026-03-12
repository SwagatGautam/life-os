/**
 * prisma/seed.ts
 * Run with: npm run db:seed
 *
 * Creates an initial ADMIN user in the database.
 * Change the credentials below (or set via env) before running in production.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@devlife-os.com";
  const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123";
  const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Admin";

  console.log(`\n🌱  Seeding admin user: ${ADMIN_EMAIL}\n`);

  const existing = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    // Promote existing user to ADMIN in case they registered normally
    if ((existing as any).role !== "ADMIN") {
      await db.user.update({
        where: { email: ADMIN_EMAIL },
        data: { role: "ADMIN" } as any,
      });
      console.log(`✅  Existing user promoted to ADMIN: ${ADMIN_EMAIL}`);
    } else {
      console.log(`ℹ️   Admin user already exists: ${ADMIN_EMAIL} — skipping.`);
    }
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await db.user.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashed,
        role: "ADMIN",
        plan: "ENTERPRISE",
      } as any,
    });
    console.log(`✅  Admin user created successfully!`);
    console.log(`\n   📧  Email    : ${ADMIN_EMAIL}`);
    console.log(`   🔐  Password : ${ADMIN_PASSWORD}`);
    console.log(`\n   ⚠️  Change the password after first login!\n`);
  }
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

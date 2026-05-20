import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding ---');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '000000';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  // 1. Create Default Admin if not exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log(`Creating default admin: ${adminEmail}`);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedAdminPassword,
        fullName: 'System Admin',
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists. Skipping creation.');
  }

  console.log('--- Seeding Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

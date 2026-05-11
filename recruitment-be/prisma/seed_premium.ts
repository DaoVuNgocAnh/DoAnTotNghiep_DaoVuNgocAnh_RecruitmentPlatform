import { PrismaClient, Role, CompanyStatus, PremiumRequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding premium requests...');
  
  for (let i = 1; i <= 15; i++) {
    const uniqueSuffix = Date.now() + i;
    
    // Create User
    const user = await prisma.user.create({
      data: {
        email: `employer_premium_${uniqueSuffix}@example.com`,
        password: 'hashed_password_placeholder', // Dummy password
        role: Role.EMPLOYER,
        fullName: `CEO Doanh Nghiệp ${i}`,
        phone: `09000000${i.toString().padStart(2, '0')}`,
      }
    });

    // Create Company
    const company = await prisma.company.create({
      data: {
        name: `Công ty TNHH Giải pháp Tech ${i}`,
        taxCode: `TAX_PREMIUM_${uniqueSuffix}`,
        description: `Đây là công ty ${i} được tạo ra để test giao diện Premium.`,
        status: CompanyStatus.VERIFIED,
        ownerId: user.id,
      }
    });

    // Update user company
    await prisma.user.update({
      where: { id: user.id },
      data: { companyId: company.id }
    });

    // Create Premium Request
    const statuses = [PremiumRequestStatus.PENDING, PremiumRequestStatus.APPROVED, PremiumRequestStatus.REJECTED];
    const status = statuses[i % 3]; // Mix statuses

    await prisma.premiumRequest.create({
      data: {
        companyId: company.id,
        userId: user.id,
        status: status,
        contactPhone: user.phone || '0123456789',
        contactEmail: user.email,
        note: status === PremiumRequestStatus.PENDING 
            ? `Công ty chúng tôi mong muốn trở thành Đối tác Uy tín. Nhờ admin duyệt giúp yêu cầu #${i}.` 
            : `Đã liên hệ qua điện thoại, nhờ admin xử lý.`
      }
    });
    
    console.log(`Created PremiumRequest #${i} for company ${company.name} with status ${status}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

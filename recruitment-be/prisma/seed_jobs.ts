import { PrismaClient, JobStatus, CompanyStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding Job Categories and Jobs...');

  // 1. Create Job Categories
  const categoryNames = [
    'Công nghệ thông tin (IT)',
    'Marketing & Truyền thông',
    'Kinh doanh & Bán hàng',
    'Thiết kế & Nghệ thuật',
    'Kế toán & Tài chính',
    'Nhân sự (HR)'
  ];

  const categories: any[] = [];
  for (const name of categoryNames) {
    // Upsert to avoid duplicates if run multiple times
    const cat = await prisma.jobCategory.upsert({
      where: { id: 'dummy-id-to-force-create' }, // Upsert by a unique field is better, but id is uuid. We'll check first.
      update: {},
      create: {
        name,
        description: `Danh mục ${name} dành cho các công việc liên quan.`,
      },
    }).catch(async () => {
      // Fallback if upsert fails (since id is not known)
      const existing = await prisma.jobCategory.findFirst({ where: { name } });
      if (existing) return existing;
      return prisma.jobCategory.create({
        data: { name, description: `Danh mục ${name} dành cho các công việc liên quan.` }
      });
    });
    categories.push(cat);
  }
  console.log(`Ensured ${categories.length} Job Categories exist.`);

  // 2. Fetch some existing verified companies
  const companies = await prisma.company.findMany({
    where: { status: CompanyStatus.VERIFIED },
    take: 10,
    include: { owner: true }
  });

  if (companies.length === 0) {
    console.log('No verified companies found. Please run seed_premium.ts first or create a company manually.');
    return;
  }

  // 3. Create Jobs
  const jobStatuses = [JobStatus.ACTIVE, JobStatus.PENDING, JobStatus.CLOSED, JobStatus.REJECTED];
  let jobCount = 0;

  for (const company of companies) {
    // Create 3 jobs for each company
    for (let i = 1; i <= 3; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = jobStatuses[Math.floor(Math.random() * jobStatuses.length)];
      const isFeatured = Math.random() > 0.8; // 20% chance to be featured

      const title = `${['Thực tập sinh', 'Nhân viên', 'Chuyên viên', 'Quản lý'][Math.floor(Math.random() * 4)]} ${category.name} ${jobCount + 1}`;
      
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + Math.floor(Math.random() * 30)); // 0-30 days from now

      await prisma.job.create({
        data: {
          title,
          description: `Mô tả công việc chi tiết cho vị trí ${title} tại công ty ${company.name}. Chúng tôi đang tìm kiếm ứng viên tài năng...`,
          requirement: `- Có ít nhất 1 năm kinh nghiệm\n- Tốt nghiệp Đại học/Cao đẳng\n- Tiếng Anh giao tiếp cơ bản`,
          salary: `${Math.floor(Math.random() * 10) + 10} - ${Math.floor(Math.random() * 20) + 20} Triệu`,
          location: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Remote'][Math.floor(Math.random() * 4)],
          status: status,
          isFeatured: isFeatured,
          viewCount: Math.floor(Math.random() * 500),
          categoryId: category.id,
          companyId: company.id,
          createdById: company.owner.id,
          expiredDate: status === JobStatus.ACTIVE ? expiredDate : null,
        }
      });
      jobCount++;
    }
  }

  console.log(`Successfully created ${jobCount} sample jobs across ${companies.length} companies.`);
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

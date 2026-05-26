import { PrismaClient, Role, UserStatus, JobStatus, JobType, CompanyStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding ---');

  // Clear existing database to avoid constraints errors
  console.log('Cleaning up existing database...');
  await prisma.applicationHistory.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  try {
    await prisma.$executeRaw`DELETE FROM "job_assignees"`;
  } catch (e) {
    // If table doesn't exist or map name differs, fallback to safe deleteMany
  }
  await prisma.savedItem.deleteMany();
  await prisma.premiumRequest.deleteMany();
  await prisma.systemLog.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.job.deleteMany();
  await prisma.resume.deleteMany();
  
  // Set all user's companyId to null to avoid constraint loops before deleting companies
  await prisma.user.updateMany({
    data: { companyId: null }
  });
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.jobCategory.deleteMany();
  console.log('Database cleaned up successfully.');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Create 1 Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      fullName: 'System Admin',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('Admin created: admin@gmail.com');

  // 2. Create 5 Job Categories
  const categories = [];
  const categoryNames = [
    { name: 'Công nghệ thông tin', desc: 'Lập trình, AI, Web, Mobile, Cloud...' },
    { name: 'Marketing / Truyền thông', desc: 'Digital Marketing, SEO, Content, Event...' },
    { name: 'Thiết kế đồ họa', desc: 'UI/UX Design, Photoshop, Figma, Video...' },
    { name: 'Hành chính / Nhân sự', desc: 'Tuyển dụng, C&B, Đào tạo, Admin...' },
    { name: 'Kinh doanh / Bán hàng', desc: 'Sales, Telesales, Account Executive...' },
  ];

  for (const cat of categoryNames) {
    const createdCat = await prisma.jobCategory.create({
      data: {
        name: cat.name,
        description: cat.desc,
      },
    });
    categories.push(createdCat);
  }
  console.log(`Created ${categories.length} job categories.`);

  // 3. Create 5 Employer Users and their corresponding 5 Companies
  const companies = [];
  const companyTemplates = [
    {
      name: 'FPT Software',
      taxCode: '0100234567',
      desc: 'Tập đoàn công nghệ hàng đầu Việt Nam cung cấp dịch vụ xuất khẩu phần mềm toàn cầu.',
      location: 'Hà Nội',
      status: CompanyStatus.VERIFIED,
      isPremium: true,
      email: 'fpt@gmail.com',
      ownerName: 'Nguyễn Văn FPT',
    },
    {
      name: 'VNG Corporation',
      taxCode: '0300765432',
      desc: 'Công ty công nghệ kỳ lân chuyên về Game, Zalo, ZaloPay và dịch vụ đám mây.',
      location: 'TP. Hồ Chí Minh',
      status: CompanyStatus.VERIFIED,
      isPremium: true,
      email: 'vng@gmail.com',
      ownerName: 'Lê Hồng VNG',
    },
    {
      name: 'Viettel Group',
      taxCode: '0100987654',
      desc: 'Tập đoàn Công nghiệp - Viễn thông Quân đội hàng đầu khu vực.',
      location: 'Đà Nẵng',
      status: CompanyStatus.VERIFIED,
      isPremium: false,
      email: 'viettel@gmail.com',
      ownerName: 'Trần Quân Viettel',
    },
    {
      name: 'MISA JSC',
      taxCode: '0100456123',
      desc: 'Công ty phát triển phần mềm kế toán và quản trị doanh nghiệp phổ biến nhất.',
      location: 'Hà Nội',
      status: CompanyStatus.VERIFIED,
      isPremium: false,
      email: 'misa@gmail.com',
      ownerName: 'Phạm Minh MISA',
    },
    {
      name: 'KMS Technology',
      taxCode: '0300987123',
      desc: 'Công ty gia công phần mềm chất lượng cao cho thị trường Mỹ và châu Âu.',
      location: 'TP. Hồ Chí Minh',
      status: CompanyStatus.PENDING, // PENDING để test duyệt công ty
      isPremium: false,
      email: 'kms@gmail.com',
      ownerName: 'Hoàng Vũ KMS',
    },
  ];

  for (let i = 0; i < companyTemplates.length; i++) {
    const tmpl = companyTemplates[i];
    
    // Create Employer User (owner)
    const owner = await prisma.user.create({
      data: {
        email: tmpl.email,
        password: hashedPassword,
        fullName: tmpl.ownerName,
        role: Role.EMPLOYER,
        status: UserStatus.ACTIVE,
      },
    });

    // Create Company
    const company = await prisma.company.create({
      data: {
        name: tmpl.name,
        taxCode: tmpl.taxCode,
        description: tmpl.desc,
        location: tmpl.location,
        status: tmpl.status,
        isPremium: tmpl.isPremium,
        ownerId: owner.id,
      },
    });

    // Link Employer back to their company
    await prisma.user.update({
      where: { id: owner.id },
      data: { companyId: company.id },
    });

    companies.push(company);
    console.log(`Created company: ${tmpl.name} (Owner: ${tmpl.email})`);
  }

  // 4. Create 5 Candidate Users
  const candidateNames = [
    { email: 'candidate1@gmail.com', name: 'Nguyễn Văn A', skills: 'ReactJS, JavaScript, HTML, CSS, Git' },
    { email: 'candidate2@gmail.com', name: 'Trần Thị B', skills: 'Node.js, Express, NestJS, PostgreSQL, Redis' },
    { email: 'candidate3@gmail.com', name: 'Lê Văn C', skills: 'Figma, UI/UX, Photoshop, Illustrator' },
    { email: 'candidate4@gmail.com', name: 'Phạm Thị D', skills: 'Google Ads, Facebook Ads, SEO, Content Marketing' },
    { email: 'candidate5@gmail.com', name: 'Hoàng Văn E', skills: 'Telesales, Communication, Negotiation' },
  ];

  for (const cand of candidateNames) {
    await prisma.user.create({
      data: {
        email: cand.email,
        password: hashedPassword,
        fullName: cand.name,
        role: Role.CANDIDATE,
        status: UserStatus.ACTIVE,
        skills: cand.skills,
      },
    });
    console.log(`Candidate created: ${cand.email}`);
  }

  // 5. Create 5 Job Postings
  const jobTemplates = [
    {
      title: 'Lập trình viên Frontend (ReactJS)',
      description: 'Chúng tôi đang tìm kiếm lập trình viên ReactJS để phát triển hệ thống Dashboard tuyển dụng thông minh cho khách hàng.',
      requirement: 'Tối thiểu 1 năm kinh nghiệm làm việc với ReactJS, Redux Toolkit, TailwindCSS. Có hiểu biết về TypeScript là lợi thế.',
      location: 'Hà Nội',
      salaryMin: 15,
      salaryMax: 25,
      jobType: JobType.FULL_TIME,
      status: JobStatus.ACTIVE,
      isFeatured: true,
      parsedSkills: 'reactjs, javascript, tailwindcss, typescript',
      companyIndex: 0, // FPT Software
      categoryIndex: 0, // Công nghệ thông tin
    },
    {
      title: 'Kỹ sư phát triển Backend (NodeJS/NestJS)',
      description: 'Thiết kế, xây dựng và tối ưu hóa các RESTful API cho ứng dụng trò chơi và thanh toán có hàng triệu người dùng hoạt động hàng ngày.',
      requirement: 'Kinh nghiệm lập trình Node.js vững vàng (Express hoặc NestJS). Am hiểu cơ sở dữ liệu quan hệ (PostgreSQL) và caching (Redis).',
      location: 'TP. Hồ Chí Minh',
      salaryMin: 20,
      salaryMax: 35,
      jobType: JobType.FULL_TIME,
      status: JobStatus.ACTIVE,
      isFeatured: true,
      parsedSkills: 'nodejs, nestjs, postgresql, redis, express',
      companyIndex: 1, // VNG Corporation
      categoryIndex: 0, // Công nghệ thông tin
    },
    {
      title: 'Chuyên viên Digital Marketing viễn thông',
      description: 'Lên kế hoạch và trực tiếp triển khai các chiến dịch chạy quảng cáo thu hút người dùng đăng ký gói cước di động và internet cáp quang.',
      requirement: 'Tối thiểu 2 năm kinh nghiệm thực thi các chiến dịch Facebook Ads, Google Ads. Có tư duy phân tích số liệu qua Google Analytics.',
      location: 'Đà Nẵng',
      salaryMin: 12,
      salaryMax: 20,
      jobType: JobType.FULL_TIME,
      status: JobStatus.ACTIVE,
      isFeatured: false,
      parsedSkills: 'facebook ads, google ads, seo, google analytics',
      companyIndex: 2, // Viettel Group
      categoryIndex: 1, // Marketing / Truyền thông
    },
    {
      title: 'Nhà thiết kế giao diện UI/UX Designer',
      description: 'Nghiên cứu hành vi người dùng, vẽ wireframes và thiết kế giao diện chi tiết cho các giải pháp phần mềm quản trị doanh nghiệp MISA.',
      requirement: 'Sử dụng thành thạo Figma. Nắm vững các nguyên lý thiết kế Visual Design và xây dựng Design System đồng nhất.',
      location: 'Hà Nội',
      salaryMin: 15,
      salaryMax: 22,
      jobType: JobType.FULL_TIME,
      status: JobStatus.ACTIVE,
      isFeatured: false,
      parsedSkills: 'figma, visual design, ui/ux, wireframe',
      companyIndex: 3, // MISA JSC
      categoryIndex: 2, // Thiết kế đồ họa
    },
    {
      title: 'Nhân viên Tư vấn Bán hàng (Telesales)',
      description: 'Liên hệ qua điện thoại giới thiệu các giải pháp chuyển đổi số cho doanh nghiệp vừa và nhỏ theo nguồn data tiềm năng do công ty cung cấp.',
      requirement: 'Giọng nói truyền cảm, dễ nghe, không nói ngọng. Có kinh nghiệm tư vấn bán hàng hoặc telesales tối thiểu 6 tháng.',
      location: 'TP. Hồ Chí Minh',
      salaryMin: 8,
      salaryMax: 15,
      jobType: JobType.FULL_TIME,
      status: JobStatus.PENDING, // PENDING để test duyệt tin tuyển dụng
      isFeatured: false,
      parsedSkills: 'telesales, communication, sales, negotiation',
      companyIndex: 4, // KMS Technology
      categoryIndex: 4, // Kinh doanh / Bán hàng
    },
  ];

  for (const jobTmpl of jobTemplates) {
    const comp = companies[jobTmpl.companyIndex];
    const cat = categories[jobTmpl.categoryIndex];

    await prisma.job.create({
      data: {
        title: jobTmpl.title,
        description: jobTmpl.description,
        requirement: jobTmpl.requirement,
        location: jobTmpl.location,
        salaryMin: jobTmpl.salaryMin,
        salaryMax: jobTmpl.salaryMax,
        jobType: jobTmpl.jobType,
        status: jobTmpl.status,
        isFeatured: jobTmpl.isFeatured,
        parsedSkills: jobTmpl.parsedSkills,
        companyId: comp.id,
        categoryId: cat.id,
      },
    });
    console.log(`Created job posting: ${jobTmpl.title} (Company: ${comp.name})`);
  }

  console.log('--- Seeding Completed Successfully! ---');
  console.log('Default credentials for all users:');
  console.log('- Password: "123456"');
  console.log('- Admin: admin@gmail.com');
  console.log('- Employers: fpt@gmail.com, vng@gmail.com, viettel@gmail.com, misa@gmail.com, kms@gmail.com');
  console.log('- Candidates: candidate1@gmail.com, candidate2@gmail.com, candidate3@gmail.com, candidate4@gmail.com, candidate5@gmail.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

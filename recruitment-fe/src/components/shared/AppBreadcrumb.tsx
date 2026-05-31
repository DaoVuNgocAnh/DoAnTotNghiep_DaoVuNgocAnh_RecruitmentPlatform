import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';
import { Home } from 'lucide-react';

const segmentMap: Record<string, string> = {
  admin: 'Quản trị',
  companies: 'Công ty',
  jobs: 'Tin tuyển dụng',
  users: 'Người dùng',
  employer: 'Nhà tuyển dụng',
  dashboard: 'Bảng điều khiển',
  company: 'Doanh nghiệp',
  create: 'Đăng tin mới',
  members: 'Thành viên',
  profile: 'Trang cá nhân',
  resumes: 'Hồ sơ & CV',
  'my-applications': 'Lịch sử ứng tuyển',
  interviews: 'Lịch phỏng vấn',
  'saved-jobs': 'Việc làm đã lưu',
  'saved-candidates': 'Ứng viên đã lưu',
  candidates: 'Danh sách ứng viên',
  analytics: 'Báo cáo thống kê',
  'job-categories': 'Danh mục ngành nghề',
  'system-history': 'Lịch sử hệ thống',
  feedback: 'Quản lý phản hồi',
  'premium-requests': 'Duyệt nâng cấp',
};

const pathMap: Record<string, string> = {
  // Candidate / General Paths
  '/resumes': 'Hồ sơ & CV của tôi',
  '/resumes/create': 'Tự tạo CV online',
  '/jobs': 'Tìm việc làm',
  '/companies': 'Danh sách công ty',
  '/my-applications': 'Hồ sơ ứng tuyển',
  '/interviews': 'Lịch hẹn phỏng vấn',
  '/saved-jobs': 'Công việc đã lưu',
  '/profile': 'Trang cá nhân',

  // Employer Paths
  '/employer/dashboard': 'Bảng điều khiển',
  '/employer/analytics': 'Báo cáo thống kê',
  '/employer/company': 'Thông tin doanh nghiệp',
  '/employer/profile': 'Thông tin cá nhân',
  '/employer/jobs': 'Danh sách tin tuyển dụng',
  '/employer/jobs/create': 'Đăng tin tuyển dụng',
  '/employer/members': 'Thành viên công ty',
  '/employer/candidates': 'Danh sách ứng viên',
  '/employer/interviews': 'Quản lý lịch phỏng vấn',
  '/employer/saved-candidates': 'Ứng viên đã lưu',

  // Admin Paths
  '/admin/dashboard': 'Bảng điều khiển',
  '/admin/companies': 'Phê duyệt doanh nghiệp',
  '/admin/jobs': 'Phê duyệt tin tuyển dụng',
  '/admin/profile': 'Thông tin cá nhân',
  '/admin/users': 'Quản lý tài khoản',
  '/admin/job-categories': 'Danh mục ngành nghề',
  '/admin/system-history': 'Lịch sử hệ thống',
  '/admin/feedback': 'Quản lý phản hồi',
  '/admin/premium-requests': 'Duyệt nâng cấp Premium',
};

const resolveLabel = (to: string, value: string): string => {
  if (pathMap[to]) {
    return pathMap[to];
  }
  
  // Xử lý các đường dẫn chi tiết động chứa ID dài
  if (to.startsWith('/jobs/') && value.length > 20) {
    return 'Chi tiết tuyển dụng';
  }
  if (to.startsWith('/companies/') && value.length > 20) {
    return 'Chi tiết doanh nghiệp';
  }
  if (to.startsWith('/employer/candidates/') && value.length > 20) {
    return 'Chi tiết ứng viên';
  }

  return segmentMap[value] || value;
};

export function AppBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Lọc bỏ các segment không muốn hiển thị nhưng vẫn giữ logic URL
  const breadcrumbItems = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    return { value, to };
  }).filter(item => item.value !== 'admin' && item.value !== 'employer');

  // Không hiển thị breadcrumb ở trang chủ hoặc khi không có mục nào sau khi lọc
  if (pathnames.length === 0 || breadcrumbItems.length === 0) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1 hover:text-[#00b14f] transition-colors">
              <Home size={14} />
              <span className="text-xs uppercase font-bold tracking-wider">Trang chủ</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => {
          const last = index === breadcrumbItems.length - 1;
          const label = resolveLabel(item.to, item.value);

          return (
            <React.Fragment key={item.to}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage className="font-black text-[#00b14f] text-xs uppercase tracking-wider">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.to} className="text-xs uppercase font-bold tracking-wider hover:text-[#00b14f] transition-colors">
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

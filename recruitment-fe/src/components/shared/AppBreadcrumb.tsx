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
          
          // Ánh xạ nhãn tiếng Việt
          let label = segmentMap[item.value] || item.value;
          
          // Xử lý logic cho ID
          if (item.value.length > 20) label = 'Chi tiết';

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

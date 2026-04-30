import { Outlet, useLocation } from 'react-router-dom';
import { EmployerSidebar } from './common/EmployerSidebar';
import { useUser } from '@/modules/user/hooks/useUser'; // SỬ DỤNG HOOK MỚI
import { Search, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils'; 
import NotificationDropdown from '@/modules/notification/components/NotificationDropdown';

// UI COMPONENTS
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppBreadcrumb } from '@/components/shared/AppBreadcrumb';

export default function EmployerLayout() {
  const { data: user } = useUser(); 
  const location = useLocation();

  const getPageTitle = (path: string) => {
    if (path.includes('dashboard')) return 'Bảng điều khiển';
    if (path.includes('jobs')) return 'Quản lý tin tuyển dụng';
    if (path.includes('candidates')) return 'Danh sách ứng viên';
    if (path.includes('company')) return 'Hồ sơ doanh nghiệp';
    if (path.includes('members')) return 'Quản lý nhân sự';
    return 'Hệ thống Quản trị';
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      <EmployerSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="font-black text-slate-800 text-lg uppercase tracking-wider border-l-4 border-[#00b14f] pl-4 whitespace-nowrap">
              {getPageTitle(location.pathname)}
            </h2>
            
            <div className="hidden lg:flex items-center relative max-w-xs w-full ml-6">
              <Search size={16} className="absolute left-3 text-slate-400 z-10" />
              <Input 
                placeholder="Tìm kiếm dữ liệu..." 
                className="pl-10 h-9 bg-slate-50 border-slate-200 rounded-full text-xs focus-visible:ring-[#00b14f] font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100 shadow-sm">
               <Zap size={14} className="text-[#00b14f] fill-[#00b14f]" />
               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Doanh nghiệp:</span>
               <span className="text-xs font-black text-slate-800 truncate max-w-[180px]">
                 {user?.companyStatus === 'VERIFIED' ? 'SmartCV Tech Group' : 'Chưa cập nhật'}
               </span>
               <Badge className={cn(
                 "border-none text-[9px] h-4 px-2 font-black shadow-sm",
                 user?.companyStatus === 'VERIFIED' ? "bg-green-100 text-[#00b14f]" : "bg-yellow-100 text-yellow-600"
               )}>
                 {user?.companyStatus || 'PENDING'}
               </Badge>
            </div>

            <NotificationDropdown />
            
            <Separator orientation="vertical" className="h-8 bg-slate-200" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-tight">
                    {user?.fullName}
                </p>
                {/* FIX LỖI 'cn' TẠI ĐÂY */}
                <p className={cn(
                  "text-[9px] font-black uppercase tracking-widest flex items-center justify-end gap-1 mt-0.5",
                  user?.isOwner ? "text-[#00b14f]" : "text-blue-500"
                )}>
                    {user?.isOwner ? <ShieldCheck size={10} /> : null}
                    {user?.isOwner ? 'Owner / Admin' : 'Recruiter Member'}
                </p>
              </div>

              <Avatar className="h-10 w-10 rounded-2xl border-2 border-white shadow-md ring-1 ring-slate-100 overflow-hidden">
                <AvatarImage src={user?.avatarUrl ?? undefined} className="object-cover" />
                <AvatarFallback className="bg-slate-100 text-slate-400 font-black">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <section className="p-8 overflow-y-auto flex-1 bg-[#f4f7f6]">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AppBreadcrumb />
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
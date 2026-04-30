import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './common/AdminSidebar';
import { useUser } from '@/modules/user/hooks/useUser'; // SỬ DỤNG HOOK MỚI
import { Search, ShieldCheck, Loader2 } from 'lucide-react';
import NotificationDropdown from '@/modules/notification/components/NotificationDropdown';

// UI COMPONENTS
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AppBreadcrumb } from '@/components/shared/AppBreadcrumb';

export default function AdminLayout() {
  const { data: user, isLoading } = useUser(); // Lấy dữ liệu realtime
  const location = useLocation();

  const getPageTitle = (path: string) => {
    if (path.includes('dashboard')) return 'Bảng điều khiển hệ thống';
    if (path.includes('companies')) return 'Phê duyệt doanh nghiệp';
    if (path.includes('users')) return 'Quản lý người dùng';
    if (path.includes('logs')) return 'Nhật ký hệ thống';
    return 'Hệ thống quản trị';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Admin mới */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="font-black text-zinc-800 text-lg uppercase tracking-wide border-l-4 border-blue-600 pl-4 whitespace-nowrap">
              {getPageTitle(location.pathname)}
            </h2>
            
            <div className="hidden md:flex items-center relative max-w-xs w-full ml-6">
              <Search size={16} className="absolute left-3 text-zinc-400 z-10" />
              <Input 
                placeholder="Tìm kiếm hệ thống..." 
                className="pl-10 h-9 bg-zinc-50 border-zinc-200 rounded-full text-xs focus-visible:ring-blue-600 font-medium shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            
            <Separator orientation="vertical" className="h-8 bg-zinc-200" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                {isLoading ? (
                  <div className="h-4 w-24 bg-slate-100 animate-pulse rounded"></div>
                ) : (
                  <>
                    <p className="text-xs font-black text-zinc-800 leading-tight">
                        {user?.fullName}
                    </p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">
                        System Admin
                    </p>
                  </>
                )}
              </div>

              <Avatar className="h-10 w-10 rounded-2xl border-2 border-white shadow-md ring-1 ring-zinc-100 overflow-hidden">
                <AvatarImage src={user?.avatarUrl ?? undefined} className="object-cover" />
                <AvatarFallback className="bg-blue-50 text-blue-600 font-black">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={20} />}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <section className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AppBreadcrumb />
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
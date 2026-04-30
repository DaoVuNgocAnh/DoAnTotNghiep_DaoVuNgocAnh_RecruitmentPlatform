import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUser } from '@/modules/user/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Loader2,
  FileText,
  CalendarCheck2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import NotificationDropdown from '@/modules/notification/components/NotificationDropdown';

export const Header = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    logout();
    navigate('/login', { replace: true });
    toast.success('Đã đăng xuất thành công');
  };

  return (
    <header className="bg-[#001529] text-white h-16 sticky top-0 z-50 shadow-md border-b border-white/5">
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#00b14f] rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              Smart<span className="text-[#00b14f]">CV</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
            <Link
              to="/"
              className={cn(
                'px-4 py-2 transition-colors',
                location.pathname === '/'
                  ? 'text-[#00b14f]'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              Trang chủ
            </Link>
            <Link
              to="/jobs"
              className={cn(
                'px-4 py-2 transition-colors',
                location.pathname === '/jobs'
                  ? 'text-[#00b14f]'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              Việc làm
            </Link>
            {user?.role === 'CANDIDATE' && (
              <>
                <Link
                  to="/resumes"
                  className={cn(
                    'px-4 py-2 transition-colors',
                    location.pathname === '/resumes'
                      ? 'text-[#00b14f]'
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  CV của tôi
                </Link>
                <Link
                  to="/interviews"
                  className={cn(
                    'px-4 py-2 transition-colors',
                    location.pathname === '/interviews'
                      ? 'text-[#00b14f]'
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  Lịch phỏng vấn
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && <NotificationDropdown />}
          {isAuthenticated && user?.role !== 'CANDIDATE' && (
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex border-[#00b14f]/30 bg-[#00b14f]/5 text-[#00b14f] hover:bg-[#00b14f] hover:text-white gap-2 font-bold"
              onClick={() =>
                navigate(
                  user?.role === 'ADMIN'
                    ? '/admin/companies'
                    : '/employer/dashboard'
                )
              }
            >
              <LayoutDashboard size={14} /> QUẢN TRỊ
            </Button>
          )}

          {isAuthenticated ? (
            isLoading ? (
              <Loader2 className="w-6 h-6 text-[#00b14f] animate-spin" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 outline-none group">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-white group-hover:text-[#00b14f] transition-colors">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                      {user.role}
                    </span>
                  </div>
                  <div className="relative">
                    <Avatar className="h-9 w-9 border-2 border-white/10 group-hover:border-[#00b14f] transition-all">
                      <AvatarImage src={user.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-slate-800 text-[#00b14f] font-bold text-slate-900">
                        {user.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-[#00b14f] w-3 h-3 rounded-full border-2 border-[#001529]"></div>
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-slate-500 group-hover:text-white transition-transform duration-300 group-data-[state=open]:rotate-180"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 mt-2 rounded-xl shadow-2xl"
                >
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="gap-3 p-3 cursor-pointer rounded-lg font-medium"
                  >
                    <UserIcon size={18} className="text-slate-400" /> Hồ sơ cá
                    nhân
                  </DropdownMenuItem>
                  {user.role === 'CANDIDATE' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/resumes')} className="gap-3 p-3 cursor-pointer rounded-lg text-[#00b14f] font-bold">
                        <FileText size={18} /> CV của tôi
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/my-applications')} className="gap-3 p-3 cursor-pointer rounded-lg text-[#00b14f] font-bold">
                        <FileText size={18} /> Đơn ứng tuyển
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/interviews')} className="gap-3 p-3 cursor-pointer rounded-lg text-[#00b14f] font-bold">
                        <CalendarCheck2 size={18} /> Lịch phỏng vấn
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === 'EMPLOYER' && (
                    <DropdownMenuItem
                      onClick={() => navigate('/employer/dashboard')}
                      className="gap-3 p-3 cursor-pointer rounded-lg text-[#00b14f] font-medium"
                    >
                      <LayoutDashboard size={18} /> Quản trị tuyển dụng
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-3 p-3 cursor-pointer rounded-lg text-red-500 font-bold"
                  >
                    <LogOut size={18} /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-sm font-bold text-slate-300 hover:text-white"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
              <Button
                className="bg-[#00b14f] hover:bg-[#009643] text-white font-bold px-6 rounded-lg"
                onClick={() => navigate('/register')}
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

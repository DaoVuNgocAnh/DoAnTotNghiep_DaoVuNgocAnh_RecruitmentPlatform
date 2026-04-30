import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  LogOut,
  Eye,
  ChevronRight,
  CheckCircle2,
  User as UserIcon,
  CalendarCheck2,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUser } from '@/modules/user/hooks/useUser';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const EmployerSidebar = () => {
  const { logout } = useAuthStore();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    logout();
    navigate('/login', { replace: true });
    toast.success('Hẹn gặp lại bạn!');
  };

  const menuItems = [
    {
      title: 'Bảng tin',
      icon: <LayoutDashboard size={20} />,
      path: '/employer/dashboard',
    },
    {
      title: 'Tin tuyển dụng',
      icon: <Briefcase size={20} />,
      path: '/employer/jobs',
    },
    {
      title: 'Quản lý ứng viên',
      icon: <Users size={20} />,
      path: '/employer/candidates',
    },
    {
      title: 'Lịch phỏng vấn',
      icon: <CalendarCheck2 size={20} />,
      path: '/employer/interviews',
    },
    {
      title: 'Thông tin công ty',
      icon: <Building2 size={20} />,
      path: '/employer/company',
    },
    ...(user?.isOwner
      ? [
          {
            title: 'Quản lý nhân sự',
            icon: <Users size={20} />,
            path: '/employer/members',
          },
        ]
      : []),
    { title: 'Hồ sơ cá nhân', icon: <UserIcon size={20} />, path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-[#001529] text-slate-400 flex flex-col h-screen sticky top-0 shadow-2xl z-20 border-r border-white/5">
      <div className="p-6">
        <Link
          to="/employer/dashboard"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-[#00b14f] rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-green-900/20 text-white font-black text-xl">
            S
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            Smart<span className="text-[#00b14f]">CV</span>
          </span>
        </Link>
        <Badge className="w-fit bg-slate-800 text-slate-300 text-[10px] font-bold py-0 px-2 border-none ring-1 ring-white/10 mt-2">
          EMPLOYER HUB
        </Badge>
      </div>

      <Separator className="bg-slate-800/50" />

      <div className="px-4 py-4 text-slate-900">
        <div className="bg-slate-800/30 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-xl border border-slate-700 shadow-inner">
            <AvatarImage src={user?.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-[#00b14f]/10 text-[#00b14f] text-xs font-black">
              {user?.fullName?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[11px] font-black truncate uppercase tracking-tight leading-none mb-1.5">
              {user?.companyStatus === 'VERIFIED'
                ? user?.companyName || 'Doanh nghiệp'
                : 'Đang xác thực...'}
            </p>
            <div className="flex items-center gap-1">
              <CheckCircle2
                size={10}
                className={
                  user?.companyStatus === 'VERIFIED'
                    ? 'text-[#00b14f]'
                    : 'text-slate-500'
                }
              />
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                {user?.companyStatus || 'No Status'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-3 px-3 italic">
          Quản trị
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center justify-between group p-3 rounded-xl transition-all duration-300',
              location.pathname === item.path
                ? 'bg-[#00b14f] text-white shadow-lg shadow-green-900/40 translate-x-1'
                : 'hover:bg-white/5 hover:text-white'
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'transition-colors duration-300',
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-[#00b14f]'
                )}
              >
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-tight">
                {item.title}
              </span>
            </div>
            {location.pathname === item.path && (
              <ChevronRight
                size={14}
                className="text-white/70 animate-in slide-in-from-left-2"
              />
            )}
          </Link>
        ))}

        <div className="pt-6 mt-4 border-t border-slate-800/50">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors text-blue-400">
              <Eye
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="font-bold text-sm text-slate-400 group-hover:text-blue-300 tracking-tight">
              Xem trang chủ
            </span>
          </Link>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <Separator className="bg-slate-800/50 mb-4" />
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 h-12 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />{' '}
          <span className="font-black text-xs uppercase tracking-widest">
            Đăng xuất
          </span>
        </Button>
      </div>
    </aside>
  );
};

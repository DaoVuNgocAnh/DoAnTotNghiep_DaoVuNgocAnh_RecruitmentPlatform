import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  UserCog,
  History,
  LogOut,
  Eye,
  ChevronRight,
  LayoutDashboard,
  User as UserIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export const AdminSidebar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    logout();
    navigate('/login', { replace: true });
    toast.success('Hệ thống đã được đăng xuất an toàn.');
  };

  const menuItems = [
    {
      title: 'Tổng quan',
      icon: <LayoutDashboard size={20} />,
      path: '/admin/dashboard',
    },
    {
      title: 'Duyệt Công ty',
      icon: <Building size={20} />,
      path: '/admin/companies',
    },
    {
      title: 'Quản lý User',
      icon: <UserCog size={20} />,
      path: '/admin/users',
    },
    {
      title: 'Nhật ký hệ thống',
      icon: <History size={20} />,
      path: '/admin/logs',
    },
    { title: 'Hồ sơ cá nhân', icon: <UserIcon size={20} />, path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col h-screen sticky top-0 shadow-2xl z-20 border-r border-zinc-800">
      <div className="p-6">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 group text-white"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-blue-900/20 font-black text-xl leading-none">
            A
          </div>
          <span className="text-2xl font-black tracking-tighter">
            Smart<span className="text-blue-500">Admin</span>
          </span>
        </Link>
        <Badge className="w-fit bg-zinc-800 text-blue-400 hover:bg-zinc-700 text-[10px] font-bold py-0 px-2 border-none ring-1 ring-blue-500/20 mt-2 uppercase tracking-widest font-sans">
          Hệ thống
        </Badge>
      </div>

      <Separator className="bg-zinc-800/50" />

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-2 text-slate-900">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-3 px-3 italic">
          Quản trị viên
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center justify-between group p-3 rounded-xl transition-all duration-300',
              location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                : 'hover:bg-zinc-900 hover:text-white text-zinc-400'
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'transition-colors duration-300',
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-zinc-500 group-hover:text-blue-500'
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

        <div className="pt-6 mt-4 border-t border-zinc-800">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-all mt-1 group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors text-zinc-500 group-hover:text-blue-500">
              <Eye
                size={18}
                className="transition-transform group-hover:scale-110"
              />
            </div>
            <span className="font-bold text-sm text-zinc-400 group-hover:text-white transition-colors tracking-tight">
              Trang chủ
            </span>
          </Link>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <Separator className="bg-zinc-800/50 mb-4" />
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 h-12 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />{' '}
          <span className="font-bold text-sm">Đăng xuất Admin</span>
        </Button>
      </div>
    </aside>
  );
};

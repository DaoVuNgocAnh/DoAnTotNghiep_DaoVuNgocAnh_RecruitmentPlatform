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
  ChevronDown,
  Loader2,
  FileText,
  Heart,
  Search,
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
    <header className="glass-header shadow-sm">
      <div className="container mx-auto h-20 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-2xl tracking-tighter">S</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              Smart<span className="text-primary">CV</span>
            </span>
          </Link>
          <nav className="hidden xl:flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider">
            {[
              { label: 'Trang chủ', path: '/' },
              { label: 'Việc làm', path: '/jobs' },
              { label: 'Công ty', path: '/companies' },
              { label: 'Hồ sơ CV', path: '/resumes', role: 'CANDIDATE' },
              { label: 'Lịch hẹn', path: '/interviews', role: 'CANDIDATE' },
            ].map((item) => (
              (!item.role || user?.role === item.role) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-full transition-all hover:bg-slate-100',
                    location.pathname === item.path
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-600'
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 group focus-within:ring-2 ring-primary/20 transition-all border border-transparent focus-within:bg-white focus-within:border-slate-200">
             <Search size={16} className="text-slate-400 group-focus-within:text-primary transition-colors" />
             <input 
                placeholder="Tìm việc ngay..." 
                className="bg-transparent border-none outline-none text-xs font-medium px-3 w-full text-slate-700 placeholder:text-slate-400"
             />
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && <NotificationDropdown />}
            
            {isAuthenticated ? (
              isLoading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-3 outline-none group bg-white border border-slate-100 p-1.5 pr-4 rounded-full shadow-sm hover:shadow-md transition-all">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarImage src={user.avatarUrl ?? undefined} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start leading-none">
                      <span className="text-[12px] font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {user.fullName}
                      </span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-transform group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-2 mt-2 rounded-2xl shadow-2xl border-slate-100"
                  >
                    <div className="px-3 py-2 mb-2 bg-slate-50 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tài khoản</p>
                        <p className="text-sm font-bold text-slate-700 mt-1 truncate">{user.email}</p>
                    </div>

                    <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-3 p-3 cursor-pointer rounded-xl font-bold text-slate-600">
                      <UserIcon size={18} /> Hồ sơ cá nhân
                    </DropdownMenuItem>

                    {user.role === 'CANDIDATE' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/resumes')} className="gap-3 p-3 cursor-pointer rounded-xl text-primary font-bold">
                          <FileText size={18} /> CV của tôi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/my-applications')} className="gap-3 p-3 cursor-pointer rounded-xl text-primary font-bold">
                          <FileText size={18} /> Đơn ứng tuyển
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/saved-jobs')} className="gap-3 p-3 cursor-pointer rounded-xl text-rose-500 font-bold">
                          <Heart size={18} className="fill-current" /> Việc làm đã lưu
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="my-2 bg-slate-100" />
                    <DropdownMenuItem onClick={handleLogout} className="gap-3 p-3 cursor-pointer rounded-xl text-slate-400 hover:text-rose-600 font-bold">
                      <LogOut size={18} /> Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-sm font-bold text-slate-600 hover:text-primary rounded-full px-6"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 rounded-full shadow-lg shadow-primary/20"
                  onClick={() => navigate('/register')}
                >
                  Đăng ký ngay
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

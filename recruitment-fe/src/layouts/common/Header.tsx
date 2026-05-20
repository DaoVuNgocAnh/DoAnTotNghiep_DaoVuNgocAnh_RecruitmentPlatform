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
  MapPin,
  Building2,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import NotificationDropdown from '@/modules/notification/components/NotificationDropdown';
import { jobApi, type Job } from '@/modules/job/api/job.api';

export const Header = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [headerSearch, setHeaderSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (headerSearch.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await jobApi.getAllJobs({ search: headerSearch, limit: 5 });
          setSearchResults(res.data.data);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [headerSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHeaderSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && headerSearch.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch("");
      setShowDropdown(false);
    }
  };

  const handleLogout = () => {
    queryClient.clear();
    logout();
    navigate('/login', { replace: true });
    toast.success('Đã đăng xuất thành công');
  };

  return (
    <header className="glass-header shadow-sm z-50">
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
          <div className="relative" ref={dropdownRef}>
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-72 group focus-within:ring-2 ring-primary/20 transition-all border border-transparent focus-within:bg-white focus-within:border-slate-200">
               <Search size={16} className="text-slate-400 group-focus-within:text-primary transition-colors" />
               <input 
                  placeholder="Tìm việc ngay..." 
                  className="bg-transparent border-none outline-none text-xs font-bold px-3 w-full text-slate-700 placeholder:text-slate-400"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  onKeyDown={handleHeaderSearch}
                  onFocus={() => headerSearch.length >= 2 && setShowDropdown(true)}
               />
               {isSearching && <Loader2 size={14} className="animate-spin text-primary" />}
            </div>

            {/* Quick Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 py-2">
                <div className="px-4 py-2 border-b border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kết quả tìm kiếm nhanh</p>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                   {searchResults.length > 0 ? (
                      searchResults.map(job => (
                        <div 
                          key={job.id} 
                          onClick={() => {
                            navigate(`/jobs/${job.id}`);
                            setShowDropdown(false);
                            setHeaderSearch("");
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-none group"
                        >
                           <h5 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h5>
                           <div className="flex items-center gap-3 mt-1 text-[10px] font-medium text-slate-400">
                              <span className="flex items-center gap-1"><Building2 size={10} /> {job.company.name}</span>
                              <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="px-4 py-8 text-center">
                         <Search size={24} className="mx-auto text-slate-100 mb-2" />
                         <p className="text-xs font-bold text-slate-400">Không tìm thấy công việc phù hợp</p>
                      </div>
                   )}
                </div>
                {searchResults.length > 0 && (
                   <div 
                    onClick={() => {
                      navigate(`/jobs?search=${encodeURIComponent(headerSearch)}`);
                      setShowDropdown(false);
                    }}
                    className="p-3 bg-slate-50 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                   >
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Xem tất cả kết quả</p>
                   </div>
                )}
              </div>
            )}
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

                    <DropdownMenuItem 
                      onClick={() => {
                        if (user.role === 'EMPLOYER') navigate('/employer/profile');
                        else if (user.role === 'ADMIN') navigate('/admin/profile');
                        else navigate('/profile');
                      }} 
                      className="gap-3 p-3 cursor-pointer rounded-xl font-bold text-slate-600"
                    >
                      <UserIcon size={18} /> Hồ sơ cá nhân
                    </DropdownMenuItem>

                    {(user.role === 'ADMIN' || user.role === 'EMPLOYER') && (
                      <DropdownMenuItem 
                        onClick={() => {
                          if (user.role === 'ADMIN') navigate('/admin/dashboard');
                          else navigate('/employer/dashboard');
                        }} 
                        className="gap-3 p-3 cursor-pointer rounded-xl font-bold text-primary"
                      >
                        <LayoutDashboard size={18} /> Trang quản trị
                      </DropdownMenuItem>
                    )}

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
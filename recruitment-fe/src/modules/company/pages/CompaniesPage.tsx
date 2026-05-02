import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { companyApi } from '../api/company.api';
import { 
  Building2, 
  Search, 
  Globe, 
  Briefcase, 
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const CompaniesPage = () => {
  const [search, setSearch] = useState('');

  const { data: companies, isLoading } = useQuery({
    queryKey: ['public-companies', search],
    queryFn: () => companyApi.getCompanies({ search }).then(res => res.data),
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* HERO SECTION - REFINED */}
      <div className="bg-[#001529] pt-24 pb-48 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#00b14f]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <Badge className="bg-[#00b14f]/10 text-[#00b14f] border-[#00b14f]/20 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Hệ sinh thái doanh nghiệp
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Định hình <span className="text-[#00b14f] relative">
              Sự nghiệp
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#00b14f]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span> <br /> tại các tập đoàn hàng đầu
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Kết nối trực tiếp với hơn 500+ doanh nghiệp uy tín, khám phá văn hóa công ty và tìm kiếm môi trường làm việc lý tưởng dành riêng cho bạn.
          </p>

          <div className="max-w-3xl mx-auto relative animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-[2.5rem] -m-1 border border-white/10"></div>
            <div className="relative flex bg-white/95 backdrop-blur-md p-3 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white">
              <div className="flex-1 flex items-center px-6">
                <Search size={22} className="text-[#00b14f] mr-4 shrink-0" />
                <input 
                  type="text"
                  placeholder="Nhập tên doanh nghiệp, lĩnh vực hoạt động..."
                  className="w-full h-14 bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300 text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button className="h-14 px-12 rounded-[2rem] bg-[#00b14f] hover:bg-[#009643] text-white font-black uppercase tracking-widest shadow-xl shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-95">
                Tìm kiếm
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} className="text-[#00b14f]" /> Top công ty Trending
              </div>
              {['FPT Software', 'Viettel', 'VNG', 'Momo'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="text-white/40 hover:text-[#00b14f] text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LISTING SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        {isLoading ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-32 flex flex-col items-center justify-center border border-white shadow-2xl">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-100 border-t-[#00b14f] rounded-full animate-spin"></div>
              <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00b14f]" size={24} />
            </div>
            <p className="mt-8 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Đang định danh mạng lưới doanh nghiệp...</p>
          </div>
        ) : companies?.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-32 text-center border border-white shadow-2xl">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
               <Building2 size={40} className="text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Tuyệt vọng tìm kiếm...</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Chúng tôi không tìm thấy kết quả nào phù hợp với "<span className="text-[#00b14f] font-bold">{search}</span>". <br /> Hãy thử một từ khóa khác hoặc xóa bộ lọc.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearch('')}
              className="mt-10 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] border-slate-200"
            >
              Xóa tìm kiếm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies?.map((company: any, index: number) => (
              <Link 
                key={company.id} 
                to={`/companies/${company.id}`}
                className="group animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full border-none shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden bg-white hover:shadow-[0_40px_80px_-24px_rgba(0,177,79,0.15)] transition-all duration-700 hover:-translate-y-3 flex flex-col">
                  {/* Decorative Banner */}
                  <div className="h-28 bg-slate-900 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00b14f]/20 to-transparent"></div>
                    <div className="absolute top-4 right-6">
                       <Badge className="bg-white/10 backdrop-blur-md text-white border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest rounded-full">
                          Verified Partner
                       </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="pt-0 px-10 pb-10 relative flex-1 flex flex-col">
                    {/* Logo Overlay */}
                    <div className="flex justify-start -mt-10 mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#00b14f]/20 blur-xl rounded-[2rem] group-hover:blur-2xl transition-all"></div>
                        <Avatar className="h-24 w-24 border-[6px] border-white shadow-2xl rounded-[2.2rem] bg-white group-hover:rotate-3 transition-transform duration-500 relative z-10">
                          <AvatarImage src={company.logoUrl} className="object-cover" />
                          <AvatarFallback className="bg-slate-50 text-[#00b14f] font-black text-3xl uppercase">
                            {company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <div className="space-y-6 flex-1 flex flex-col">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight group-hover:text-[#00b14f] transition-colors line-clamp-2 leading-tight">
                          {company.name}
                        </h3>
                        {company.websiteUrl && (
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-3">
                            <Globe size={12} className="text-[#00b14f]" /> 
                            <span className="truncate">{company.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 italic opacity-80 flex-1">
                        {company.description || "Doanh nghiệp tiên phong trong lĩnh vực công nghệ và đổi mới sáng tạo."}
                      </p>

                      <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-[#00b14f] group-hover:text-white transition-all duration-500">
                               <Briefcase size={16} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cơ hội</p>
                               <p className="text-sm font-black text-slate-700 uppercase">{company._count?.jobs || 0} Đang tuyển</p>
                            </div>
                        </div>
                        
                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-[#00b14f] group-hover:text-[#00b14f] transition-all duration-500 group-hover:translate-x-2">
                           <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* BOTTOM CTA */}
        {!isLoading && companies?.length > 0 && (
          <div className="mt-24 text-center">
             <div className="inline-flex items-center gap-4 bg-white px-10 py-6 rounded-[2.5rem] shadow-xl border border-white">
                <Sparkles className="text-yellow-400" size={24} />
                <p className="text-slate-600 font-bold">Bạn là nhà tuyển dụng? </p>
                <Button variant="link" className="text-[#00b14f] font-black uppercase tracking-widest text-xs p-0 h-auto" asChild>
                   <Link to="/register">Gia nhập mạng lưới ngay</Link>
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};


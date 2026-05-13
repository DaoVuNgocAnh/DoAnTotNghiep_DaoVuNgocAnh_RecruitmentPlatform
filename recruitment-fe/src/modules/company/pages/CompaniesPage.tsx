import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { companyApi } from '../api/company.api';
import { 
  Building2, 
  Search, 
  ChevronRight,
  MapPin,
  Briefcase,
  Star
} from 'lucide-react';

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination } from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';

export const CompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ['public-companies', search, page],
    queryFn: () => companyApi.getCompanies({ search, page, limit }).then(res => res.data),
  });

  const companies = companiesData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Hero Header Redesigned */}
      <div className="bg-[#001529] pt-28 pb-44 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
           <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-[#00b14f]/30 rounded-full blur-[150px]"></div>
           <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Badge className="bg-[#00b14f]/10 text-[#00b14f] border-none mb-6 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">
            Hơn 500+ doanh nghiệp hàng đầu
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
            Khám phá <br /> <span className="text-[#00b14f] italic">văn hóa</span> công ty
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Tìm hiểu môi trường làm việc, phúc lợi và những cơ hội tuyệt vời để xây dựng sự nghiệp vững chắc.
          </p>

          <div className="max-w-2xl mx-auto relative group">
             <div className="flex bg-white p-2.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/10 transition-all focus-within:ring-8 ring-[#00b14f]/5">
                <div className="flex-1 flex items-center px-6">
                  <Search size={22} className="text-slate-300 mr-4" />
                  <input 
                    type="text"
                    placeholder="Tìm tên doanh nghiệp..."
                    className="w-full h-14 bg-transparent border-none outline-none font-bold text-slate-800 text-lg placeholder:text-slate-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button className="h-14 px-10 rounded-[1.5rem] bg-[#00b14f] hover:bg-[#009643] text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-green-900/20">
                  Tìm kiếm
                </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Listing Content - Card Grid Redesigned */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="h-[420px] bg-white rounded-[2.5rem] animate-pulse shadow-sm border border-slate-100"></div>
            ))}
          </div>
        ) : companies?.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center shadow-xl border border-slate-100">
            <Building2 size={64} className="text-slate-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Không tìm thấy công ty</h3>
            <p className="text-slate-400 mt-2 font-medium italic">Hãy thử từ khóa khác nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies?.map((company: any) => (
              <Link 
                key={company.id} 
                to={`/companies/${company.id}`}
                className="group h-full"
              >
                <Card className="h-full border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col group/item">
                  {/* Company Header with Cover Photo */}
                  <div className="h-44 relative overflow-hidden shrink-0">
                     <img 
                        src={company.coverUrl || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={company.name}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                     
                     {company.isPremium && (
                        <div className="absolute top-4 right-4 z-10">
                           <Badge className="bg-amber-400 text-amber-900 border-none px-3 py-1 font-black text-[9px] uppercase rounded-full gap-1 shadow-lg">
                              <Star size={10} fill="currentColor" /> Premium
                           </Badge>
                        </div>
                     )}
                     
                     <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                        <Avatar className="h-20 w-20 border-[4px] border-white shadow-xl rounded-2xl bg-white shrink-0 -mb-10 relative z-10 transition-transform group-hover/item:scale-105 duration-500">
                          <AvatarImage src={company.logoUrl} className="object-contain p-2" />
                          <AvatarFallback className="bg-slate-50 text-[#00b14f] font-black text-2xl uppercase">
                            {company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                     </div>
                  </div>
                  
                  <CardContent className="px-8 pt-14 pb-8 flex flex-col flex-1 relative">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#00b14f] transition-colors line-clamp-1 uppercase tracking-tight mb-2">
                        {company.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4">
                         <MapPin size={12} className="text-[#00b14f]" /> {company.location || "Việt Nam"}
                      </div>

                      <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed mb-6 italic opacity-80 min-h-[4.5rem]">
                        {company.description || "Doanh nghiệp uy tín đồng hành cùng ứng viên trên con đường sự nghiệp."}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Cơ hội hiện có</span>
                          <div className="flex items-center gap-1.5">
                             <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#00b14f]">
                                <Briefcase size={14} />
                             </div>
                             <span className="text-sm font-black text-slate-700 uppercase">{company._count?.jobs || 0} Việc làm</span>
                          </div>
                       </div>
                       
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-[#00b14f] flex items-center justify-center text-slate-300 group-hover:text-white transition-all duration-500 group-hover:translate-x-2">
                          <ChevronRight size={24} />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {companiesData && (
          <div className="mt-20 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={companiesData.meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

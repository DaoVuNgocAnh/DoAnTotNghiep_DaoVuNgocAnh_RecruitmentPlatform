import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { companyApi } from '../api/company.api';
import { 
  Building2, 
  Search, 
  ChevronRight,
  MapPin
} from 'lucide-react';

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination } from '@/components/shared/Pagination';

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
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Hero Header */}
      <div className="bg-slate-900 pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
            Khám phá văn hóa <br /> <span className="text-primary italic">Doanh nghiệp</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto mb-12">
            Tìm hiểu môi trường làm việc, phúc lợi và những cơ hội tuyệt vời từ các nhà tuyển dụng hàng đầu.
          </p>

          <div className="max-w-2xl mx-auto relative group">
             <div className="flex bg-white p-2 rounded-2xl shadow-2xl border border-white transition-all focus-within:ring-4 ring-primary/10">
                <div className="flex-1 flex items-center px-4">
                  <Search size={20} className="text-slate-400 mr-3" />
                  <input 
                    type="text"
                    placeholder="Tìm tên công ty..."
                    className="w-full h-12 bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs transition-all">
                  Tìm kiếm
                </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Listing Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="h-80 bg-white rounded-3xl animate-pulse shadow-sm border border-slate-100"></div>
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
                className="group"
              >
                <Card className="h-full border-transparent shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
                  <div className="h-24 bg-slate-50 border-b border-slate-100 relative">
                     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                  </div>
                  
                  <CardContent className="px-8 pb-8 flex flex-col items-center text-center -mt-12 relative z-10">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg rounded-2xl bg-white group-hover:scale-110 transition-transform duration-500">
                        <AvatarImage src={company.logoUrl} className="object-contain p-2" />
                        <AvatarFallback className="bg-slate-50 text-primary font-black text-2xl uppercase">
                          {company.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                      {company.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                       <MapPin size={12} className="text-primary" /> Việt Nam
                    </div>

                    <p className="text-slate-500 text-sm font-medium mt-6 line-clamp-2 italic opacity-80 min-h-[2.5rem]">
                      {company.description || "Doanh nghiệp uy tín đồng hành cùng ứng viên trên con đường sự nghiệp."}
                    </p>

                    <div className="w-full pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="text-left">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cơ hội</p>
                          <p className="text-sm font-black text-slate-700 uppercase">{company._count?.jobs || 0} Việc làm</p>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight size={20} />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {companiesData && (
          <div className="mt-16 flex justify-center">
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

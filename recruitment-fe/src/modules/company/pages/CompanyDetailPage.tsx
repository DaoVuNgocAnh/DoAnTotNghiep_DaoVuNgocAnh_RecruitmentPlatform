import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyApi } from '../api/company.api';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Briefcase, 
  Info,
  Calendar,
  Users,
  ShieldCheck,
  ExternalLink,
  Mail,
  ArrowLeft,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// UI COMPONENTS
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { JobCard } from '@/components/shared/JobCard';

export const CompanyDetailPage = () => {
  const { id } = useParams();

  const { data: company, isLoading } = useQuery({
    queryKey: ['public-company-detail', id],
    queryFn: () => companyApi.getCompanyById(id!).then(res => res.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50/50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 border-t-[#00b14f] rounded-full animate-spin"></div>
          <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00b14f]" size={24} />
        </div>
        <p className="mt-8 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Đang truy xuất hồ sơ doanh nghiệp...
        </p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50/50">
        <Building2 size={80} className="text-slate-100 mb-8" />
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Dữ liệu không tồn tại</h2>
        <p className="text-slate-500 mb-10 font-medium italic">Chúng tôi không thể tìm thấy thông tin cho định danh này.</p>
        <Button asChild className="rounded-2xl h-14 px-10 bg-[#00b14f] hover:bg-[#009643] font-black uppercase tracking-widest">
            <Link to="/companies">Quay lại danh sách doanh nghiệp</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-32">
      {/* HEADER HERO - PREMIUM DESIGN */}
      <div className="h-[400px] relative overflow-hidden bg-[#001529]">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#00b14f] rounded-full filter blur-[150px] opacity-20 animate-pulse"></div>
           <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full filter blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-32 relative z-10">
           <Link to="/companies" className="inline-flex items-center gap-2 text-white/60 hover:text-[#00b14f] font-black uppercase tracking-widest text-[10px] mb-8 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại khám phá
           </Link>
           
           <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-[#00b14f]/30 blur-2xl rounded-[3rem] group-hover:blur-3xl transition-all"></div>
                <Avatar className="h-40 w-40 md:h-48 md:w-48 border-[8px] border-white shadow-2xl rounded-[3rem] bg-white group-hover:scale-105 transition-transform duration-700 relative z-10">
                  <AvatarImage src={company.logoUrl} className="object-cover" />
                  <AvatarFallback className="bg-slate-50 text-[#00b14f] font-black text-5xl uppercase">
                    {company.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-4 -right-4 bg-[#00b14f] text-white p-3 rounded-2xl shadow-xl z-20 border-4 border-white animate-bounce-slow">
                   <ShieldCheck size={24} />
                </div>
              </div>

              <div className="text-center md:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                    {company.name}
                  </h1>
                  <Badge className="bg-[#00b14f] text-white border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-full">
                    Đối tác chiến lược
                  </Badge>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/60 font-black uppercase tracking-widest text-[10px]">
                   <span className="flex items-center gap-2"><Globe size={14} className="text-[#00b14f]"/> {company.websiteUrl || "N/A"}</span>
                   <span className="flex items-center gap-2"><MapPin size={14} className="text-[#00b14f]"/> Trụ sở chính: Việt Nam</span>
                   <span className="flex items-center gap-2"><Users size={14} className="text-[#00b14f]"/> 500+ Nhân sự</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden bg-white">
               <CardHeader className="bg-slate-50/50 border-b border-slate-50 px-8 py-6">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-2">
                     <Info size={16} className="text-[#00b14f]" /> Thông tin doanh nghiệp
                  </h3>
               </CardHeader>
               <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#00b14f]/10 transition-colors">
                        <Calendar size={18} className="text-[#00b14f]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày gia nhập hệ thống</p>
                        <p className="text-sm font-black text-slate-700 uppercase">
                           {format(new Date(company.createdAt), 'dd MMMM, yyyy', { locale: vi })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                        <CheckCircle2 size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái xác thực</p>
                        <p className="text-sm font-black text-blue-600 uppercase">Đã kiểm duyệt bởi SmartCV</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Kênh liên hệ chính thức</h4>
                     <Button variant="outline" className="w-full justify-start rounded-2xl h-12 border-slate-100 font-bold text-slate-600 gap-3 group hover:border-[#00b14f] hover:text-[#00b14f] transition-all" asChild>
                        <a href={company.websiteUrl} target="_blank" rel="noreferrer">
                           <ExternalLink size={16} /> Website doanh nghiệp
                        </a>
                     </Button>
                     <Button variant="outline" className="w-full justify-start rounded-2xl h-12 border-slate-100 font-bold text-slate-600 gap-3 group hover:border-[#00b14f] hover:text-[#00b14f] transition-all">
                        <Mail size={16} /> Liên hệ phòng HR
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-[#00b14f] to-[#009643] p-10 rounded-[2.5rem] text-white shadow-[0_32px_64px_-16px_rgba(0,177,79,0.3)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <Badge className="bg-white/20 text-white border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest mb-6">Hot Opening</Badge>
                  <h3 className="text-2xl font-black uppercase mb-4 leading-tight">Cơ hội bứt phá <br /> sự nghiệp</h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed mb-8">Trở thành một phần của đội ngũ nhân tài tại {company.name} ngay hôm nay.</p>
                  <Button className="w-full rounded-2xl font-black text-[#00b14f] bg-white hover:bg-slate-50 uppercase tracking-widest text-xs h-14 shadow-xl transition-all active:scale-95">
                     Xem các vị trí ứng tuyển
                  </Button>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN - MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            {/* ABOUT SECTION */}
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] rounded-[2.5rem] bg-white overflow-hidden">
              <CardContent className="p-10 md:p-14">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#00b14f] shrink-0">
                      <Sparkles size={24} />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Câu chuyện doanh nghiệp</h2>
                </div>
                <div className="text-slate-600 font-medium leading-[1.8] text-lg italic border-l-8 border-[#00b14f]/10 pl-8 py-2">
                  {company.description || "Doanh nghiệp hiện chưa cập nhật bản giới thiệu chi tiết. Vui lòng quay lại sau hoặc liên hệ trực tiếp qua website của công ty."}
                </div>
              </CardContent>
            </Card>

            {/* JOBS LISTING SECTION */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div>
                  <h2 className="text-3xl font-black text-[#001529] uppercase tracking-tighter flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Briefcase size={24} />
                    </div>
                    Vị trí tuyển dụng
                  </h2>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1 ml-16 italic">Khám phá cơ hội nghề nghiệp hiện có</p>
                </div>
                <div className="bg-white px-6 py-2 rounded-2xl border shadow-sm flex items-center gap-3">
                   <Badge className="bg-blue-50 text-blue-600 border-none font-black text-xs px-4 py-1.5 rounded-full uppercase">
                     {company.jobs?.length || 0} Đang mở
                   </Badge>
                </div>
              </div>

              {company.jobs?.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                  {company.jobs.map((job: any) => (
                    <div key={job.id} className="hover:-translate-y-2 transition-all duration-500">
                      <JobCard 
                        job={{
                          ...job,
                          company: {
                            name: company.name,
                            logoUrl: company.logoUrl,
                          }
                        }} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-24 text-center shadow-xl border border-slate-100 border-dashed">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Search size={32} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Chưa có tin tuyển dụng</h3>
                  <p className="text-slate-400 text-sm font-medium italic">Công ty hiện tại không có vị trí nào đang mở. Hãy quay lại sau nhé!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

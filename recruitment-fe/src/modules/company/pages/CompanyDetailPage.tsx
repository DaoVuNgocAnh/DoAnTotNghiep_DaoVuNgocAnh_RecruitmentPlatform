import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyApi } from '../api/company.api';
import { 
  Globe, 
  MapPin, 
  Briefcase, 
  Info,
  Calendar,
  Users,
  ShieldCheck,
  ExternalLink,
  Mail,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  Search
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
      <div className="flex flex-col h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang kết nối hồ sơ doanh nghiệp...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-black text-slate-800 uppercase mb-4">Doanh nghiệp không tồn tại</h2>
        <Button asChild rounded-full>
            <Link to="/companies">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Premium Hero Banner */}
      <div className="relative">
        <div className="h-64 md:h-80 bg-slate-900 overflow-hidden">
           <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-40"
              alt="cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
        </div>

        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 relative z-10">
              <div className="relative group shrink-0">
                <Avatar className="h-40 w-40 md:h-48 md:w-48 border-[6px] border-white shadow-xl rounded-[2.5rem] bg-white transition-transform hover:scale-[1.02] duration-500">
                  <AvatarImage src={company.logoUrl} className="object-contain p-4" />
                  <AvatarFallback className="bg-slate-50 text-primary font-black text-5xl uppercase">
                    {company.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                   <ShieldCheck size={20} />
                </div>
              </div>

              <div className="flex-1 pb-4 text-center md:text-left space-y-4">
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
                      {company.name}
                    </h1>
                    <Badge className="bg-primary/10 text-primary border-none px-3 py-1 font-bold text-[10px] uppercase rounded-full">
                       Verified Partner
                    </Badge>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <span className="flex items-center gap-1.5"><Globe size={14} className="text-primary"/> {company.websiteUrl?.replace(/^https?:\/\//, '') || "N/A"}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary"/> Trụ sở chính: Việt Nam</span>
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-primary"/> 500+ Nhân sự</span>
                 </div>
              </div>

              <div className="pb-4 hidden lg:flex gap-3">
                 <Button className="rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs px-8 h-12 shadow-lg shadow-primary/20">
                    Theo dõi
                 </Button>
                 <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-slate-200">
                    <Mail size={18} className="text-slate-400" />
                 </Button>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info (Left) */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-transparent shadow-sm rounded-3xl bg-white overflow-hidden">
               <CardHeader className="border-b border-slate-50 px-8 py-6">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm flex items-center gap-2">
                     <Sparkles size={18} className="text-primary" /> Về chúng tôi
                  </h3>
               </CardHeader>
               <CardContent className="p-8 md:p-10">
                 <div className="text-slate-600 font-medium leading-[1.8] text-base whitespace-pre-wrap">
                   {company.description || "Doanh nghiệp hiện chưa cập nhật bản giới thiệu chi tiết. Vui lòng quay lại sau hoặc liên hệ trực tiếp qua website của công ty."}
                 </div>
               </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <Briefcase size={20} />
                    </div>
                    Vị trí đang tuyển dụng
                 </h2>
                 <Badge variant="secondary" className="bg-white border-slate-200 text-slate-500 font-bold px-4 py-1.5 rounded-full">
                    {company.jobs?.length || 0} Cơ hội
                 </Badge>
              </div>

              {(company as any).jobs && (company as any).jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {(company as any).jobs.map((job: any) => (
                    <JobCard 
                      key={job.id}
                      job={{
                        ...job,
                        company: {
                          name: company.name,
                          logoUrl: company.logoUrl,
                        }
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-slate-100 border-dashed">
                  <Search size={48} className="text-slate-100 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold italic">Hiện chưa có tin tuyển dụng nào đang mở.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-transparent shadow-sm rounded-3xl bg-white overflow-hidden">
               <CardHeader className="border-b border-slate-50 px-8 py-6">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm flex items-center gap-2">
                     <Info size={18} className="text-primary" /> Thông tin nhanh
                  </h3>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Calendar size={16} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày thành lập</p>
                        <p className="text-sm font-bold text-slate-700">
                           {format(new Date(company.createdAt), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xác thực</p>
                        <p className="text-sm font-bold text-primary uppercase">Đã kiểm duyệt</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <LayoutGrid size={16} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lĩnh vực</p>
                        <p className="text-sm font-bold text-slate-700 uppercase">Công nghệ thông tin</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-50" />

                  <div className="space-y-3">
                     <Button variant="outline" className="w-full rounded-xl h-12 border-slate-100 font-bold text-slate-600 gap-3 group transition-all" asChild>
                        <a href={company.websiteUrl} target="_blank" rel="noreferrer">
                           <ExternalLink size={16} className="group-hover:text-primary transition-colors" /> Website chính thức
                        </a>
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="bg-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase mb-3">Làm việc tại {company.name.split(' ')[0]}?</h3>
                  <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">Môi trường trẻ trung, năng động và nhiều cơ hội thăng tiến đang chờ đợi bạn.</p>
                  <Button className="w-full rounded-xl font-black text-primary bg-white hover:bg-slate-50 uppercase tracking-widest text-[10px] h-12 transition-all">
                     Khám phá văn hóa
                  </Button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-loader-2 ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

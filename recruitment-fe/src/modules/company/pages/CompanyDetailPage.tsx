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
  Search,
  Loader2,
  Filter,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

// UI COMPONENTS
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { JobCard } from '@/components/shared/JobCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LOCATIONS, JOB_TYPES } from '@/constants/job.constants';
import { useAllJobs } from '../../job/api/job.api';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from 'sonner';

export const CompanyDetailPage = () => {
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('Tất cả địa điểm');
  const [jobType, setJobType] = useState('ALL');
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const limit = 5;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Đã sao chép liên kết công ty');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = window.location.href;
  const companyTitle = `Tuyển dụng tại công ty `;

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['public-company-detail', id],
    queryFn: () => companyApi.getCompanyById(id!).then(res => res.data),
    enabled: !!id,
  });

  const { data: jobsData, isLoading: jobsLoading } = useAllJobs({
    companyId: id,
    search: search || undefined,
    location: location === 'Tất cả địa điểm' ? undefined : location,
    jobType: jobType === 'ALL' ? undefined : jobType,
    page,
    limit,
  });

  if (companyLoading) {
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
        <Button asChild className="rounded-full">
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
              src={company.coverUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"} 
              className="w-full h-full object-cover opacity-30"
              alt="cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
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
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none uppercase drop-shadow-sm">
                      {company.name}
                    </h1>
                    <Badge className="bg-primary/20 text-primary-foreground border-none px-3 py-1 font-bold text-[10px] uppercase rounded-full backdrop-blur-md">
                       Verified Partner
                    </Badge>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                    <span className="flex items-center gap-1.5"><Globe size={14} className="text-primary"/> {company.websiteUrl?.replace(/^https?:\/\//, '') || "N/A"}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary"/> {company.location || "Chưa cập nhật"}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-primary"/> Doanh nghiệp uy tín</span>
                 </div>
              </div>

              <div className="pb-4 hidden lg:flex gap-3">
                 <Button className="rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs px-8 h-12 shadow-lg shadow-primary/20 border-none">
                    Theo dõi
                 </Button>
                 <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20">
                    <Mail size={18} />
                 </Button>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info (Left) */}
          <div className="lg:col-span-8 space-y-12">
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

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <Briefcase size={20} />
                    </div>
                    Vị trí đang tuyển dụng
                 </h2>
                 <Badge variant="secondary" className="bg-white border-slate-200 text-slate-500 font-bold px-4 py-1.5 rounded-full w-fit">
                    {jobsData?.meta.total || 0} Cơ hội
                 </Badge>
              </div>

              {/* Filtering & Search Section */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                 <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                       placeholder="Tìm kiếm tên công việc..." 
                       className="h-12 pl-12 rounded-xl border-slate-100 focus-visible:ring-primary font-medium"
                       value={search}
                       onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                       }}
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={location} onValueChange={(v) => { setLocation(v); setPage(1); }}>
                       <SelectTrigger className="h-12 w-full md:w-[180px] rounded-xl border-slate-100 font-bold text-xs uppercase text-slate-600">
                          <div className="flex items-center gap-2">
                             <MapPin size={14} className="text-primary" />
                             <SelectValue placeholder="Địa điểm" />
                          </div>
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                          {LOCATIONS.map(loc => (
                             <SelectItem key={loc} value={loc} className="font-bold text-xs uppercase py-3">{loc}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>

                    <Select value={jobType} onValueChange={(v) => { setJobType(v); setPage(1); }}>
                       <SelectTrigger className="h-12 w-full md:w-[180px] rounded-xl border-slate-100 font-bold text-xs uppercase text-slate-600">
                          <div className="flex items-center gap-2">
                             <Filter size={14} className="text-primary" />
                             <SelectValue placeholder="Hình thức" />
                          </div>
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                          <SelectItem value="ALL" className="font-bold text-xs uppercase py-3 text-primary">Tất cả hình thức</SelectItem>
                          {JOB_TYPES.map(type => (
                             <SelectItem key={type.value} value={type.value} className="font-bold text-xs uppercase py-3">{type.label}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              {jobsLoading ? (
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
                    ))}
                 </div>
              ) : jobsData?.data && jobsData.data.length > 0 ? (
                <div className="space-y-4">
                  {jobsData.data.map((job: any) => (
                    <JobCard 
                      key={job.id}
                      variant="list"
                      job={{
                        ...job,
                        company: {
                          name: company.name,
                          logoUrl: company.logoUrl,
                        }
                      }} 
                    />
                  ))}

                  <div className="pt-8 flex justify-center">
                     <Pagination 
                        currentPage={page}
                        totalPages={jobsData.meta.totalPages}
                        onPageChange={(newPage) => {
                          setPage(newPage);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                     />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-slate-100 border-dashed">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-slate-200" />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 uppercase mb-2">Không tìm thấy vị trí phù hợp</h4>
                  <p className="text-slate-400 font-bold italic text-sm">Hãy thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc.</p>
                  <Button variant="ghost" onClick={() => { setSearch(''); setLocation('Tất cả địa điểm'); setJobType('ALL'); }} className="mt-6 text-primary font-black uppercase tracking-widest text-[10px]">Xóa bộ lọc</Button>
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

            {/* Google Maps Embed Relocated to Sidebar */}
            {company.location && (
              <Card className="border-transparent shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-50 px-8 py-5">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-[11px] flex items-center gap-2">
                    <MapPin size={16} className="text-primary" /> Bản đồ vị trí
                  </h3>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(company.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </CardContent>
              </Card>
            )}

            <Card className="border-transparent shadow-sm rounded-[2.5rem] bg-white overflow-hidden border border-slate-100">
               <CardHeader className="border-b border-slate-50 px-8 py-6">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-xs flex items-center gap-2">
                    <Share2 size={16} className="text-primary" /> Chia sẻ công ty
                  </h3>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="relative group">
                    <Input 
                      readOnly 
                      value={shareUrl}
                      className="h-12 pr-12 rounded-xl border-slate-100 bg-slate-50/50 font-medium text-slate-500 text-xs focus-visible:ring-primary truncate"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={handleCopyLink}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-white text-slate-400 hover:text-primary transition-all"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className="rounded-xl h-12 border-slate-100 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/20 transition-all group"
                      asChild
                    >
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">
                        <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl h-12 border-slate-100 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/20 transition-all group"
                      asChild
                    >
                      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(companyTitle + company.name)}`} target="_blank" rel="noreferrer">
                        <Twitter size={18} className="group-hover:scale-110 transition-transform" />
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl h-12 border-slate-100 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/20 transition-all group"
                      asChild
                    >
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">
                        <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                      </a>
                    </Button>
                  </div>
               </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

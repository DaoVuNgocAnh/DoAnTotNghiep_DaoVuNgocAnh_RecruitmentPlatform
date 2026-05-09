import { useParams, useNavigate, Link } from "react-router-dom";
import { useJobDetail } from "../../job/api/job.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Building2, ChevronLeft, ShieldCheck, Loader2, Share2, Info, Briefcase, GraduationCap, MapPinned } from "lucide-react";
import { ApplyModal } from "../components/ApplyModal";
import { useUser } from "@/modules/user/hooks/useUser";
import { SaveButton } from "@/modules/saved-items/components/SaveButton";

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJobDetail(id!);
  const { data: user } = useUser();

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Đang tải chi tiết cơ hội...</p>
    </div>
  );

  if (!job) return (
    <div className="h-screen flex flex-col items-center justify-center text-slate-500 gap-6">
      <Info size={64} className="text-slate-200" />
      <h2 className="text-2xl font-black uppercase tracking-tight">Không tìm thấy việc làm</h2>
      <Button onClick={() => navigate('/jobs')} variant="outline" className="rounded-full px-8">Quay lại danh sách</Button>
    </div>
  );

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-20 z-30 hidden md:block">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
           <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="hover:bg-slate-50 rounded-full gap-2 font-bold text-slate-500 transition-all text-xs"
          >
             <ChevronLeft size={14} /> QUAY LẠI
          </Button>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary transition-colors">
                <Share2 size={18} />
             </Button>
             <SaveButton targetId={job.id} targetType="JOB" className="rounded-full border-slate-100" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <Briefcase size={120} />
               </div>

               <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
                  <div className="w-24 h-24 rounded-2xl border border-slate-100 flex-shrink-0 flex items-center justify-center p-3 bg-white shadow-inner">
                    {job.company.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                    ) : <Building2 size={40} className="text-slate-200" />}
                  </div>
                  <div className="flex-1 space-y-3">
                     <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                       {job.title}
                     </h1>
                     <Link to={`/companies/${job.companyId}`} className="text-primary font-bold hover:underline block uppercase tracking-tight">
                        {job.company.name}
                     </Link>
                     <div className="flex flex-wrap gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange-400" /> Hạn nộp: {new Date(job.expiredDate || job.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center gap-1.5"><MapPinned size={14} className="text-blue-400" /> {job.location}</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mức lương</p>
                     <p className="text-lg font-black text-primary">{job.salary}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hình thức</p>
                     <p className="text-sm font-bold text-slate-700 uppercase">Toàn thời gian</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kinh nghiệm</p>
                     <p className="text-sm font-bold text-slate-700 uppercase">1 - 3 năm</p>
                  </div>
               </div>

               <div className="mt-8 flex gap-4">
                  {user?.role !== 'EMPLOYER' && user?.role !== 'ADMIN' ? (
                     <div className="flex-1">
                        <ApplyModal jobId={job.id} jobTitle={job.title} />
                     </div>
                  ) : (
                     <div className="flex-1 p-4 bg-amber-50 rounded-2xl text-xs text-amber-600 font-bold uppercase text-center border border-amber-100">
                        Chế độ xem trước dành cho quản trị
                     </div>
                  )}
                  <SaveButton targetId={job.id} targetType="JOB" className="h-14 px-6 rounded-2xl border-slate-100 md:hidden" />
               </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
               <div className="space-y-12">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-1 h-8 bg-primary rounded-full"></div>
                       <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Chi tiết tin tuyển dụng</h2>
                    </div>
                    
                    <div className="space-y-8">
                       <div>
                          <h4 className="font-black text-slate-800 text-sm uppercase mb-4 flex items-center gap-2">
                             <Briefcase size={16} className="text-primary" /> Mô tả công việc
                          </h4>
                          <div className="text-slate-600 leading-[1.8] font-medium whitespace-pre-wrap pl-6">
                             {job.description}
                          </div>
                       </div>

                       <div>
                          <h4 className="font-black text-slate-800 text-sm uppercase mb-4 flex items-center gap-2">
                             <GraduationCap size={16} className="text-primary" /> Yêu cầu ứng viên
                          </h4>
                          <div className="text-slate-600 leading-[1.8] font-medium whitespace-pre-wrap pl-6">
                             {job.requirement}
                          </div>
                       </div>
                    </div>
                  </section>
               </div>
               
               <Separator className="my-10 bg-slate-100" />
               
               <div className="flex items-center justify-between text-slate-400">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Mã tin: {job.id.slice(0, 8)}</p>
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={14} className="text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Báo cáo tin tuyển dụng</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
               <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-3 overflow-hidden transition-transform hover:scale-105 duration-300">
                  {job.company.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                  ) : <Building2 size={32} className="text-slate-200" />}
               </div>
               <h3 className="font-black text-slate-900 uppercase text-base tracking-tight mb-2 leading-tight">
                  {job.company.name}
               </h3>
               <div className="flex justify-center mb-6">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[10px] px-3 py-1 rounded-full uppercase">
                     Verified Business
                  </Badge>
               </div>
               <Button asChild variant="outline" className="w-full rounded-xl font-bold border-slate-100 hover:bg-slate-50 transition-all">
                  <Link to={`/companies/${job.companyId}`}>Xem trang công ty</Link>
               </Button>
            </div>

            {/* Quick Tips / Info */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10 space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary">Mẹo cho ứng viên</h4>
                  <p className="text-xs font-medium leading-relaxed text-slate-300">
                    Ứng tuyển ngay để không bỏ lỡ cơ hội. Nhà tuyển dụng sẽ nhận được CV của bạn ngay lập tức qua hệ thống SmartCV.
                  </p>
                  <ul className="space-y-3 pt-2">
                     <li className="flex items-start gap-2 text-[10px] font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
                        <span>Cập nhật CV mới nhất trước khi gửi</span>
                     </li>
                     <li className="flex items-start gap-2 text-[10px] font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
                        <span>Viết thư giới thiệu ngắn gọn, ấn tượng</span>
                     </li>
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

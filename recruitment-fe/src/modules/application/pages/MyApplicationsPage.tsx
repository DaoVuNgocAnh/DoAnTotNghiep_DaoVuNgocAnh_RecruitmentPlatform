import { useMyApplications } from "../../application/api/application.api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Calendar, FileText, Loader2, Info, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const MyApplicationsPage = () => {
  const { data: applications, isLoading } = useMyApplications();

  const getStatusConfig = (status: string) => {
    const configs: any = {
      PENDING: { 
        label: "Đang chờ duyệt", 
        className: "bg-amber-50 text-amber-600 ring-amber-500/20", 
        icon: <Clock size={12} /> 
      },
      REVIEWING: { 
        label: "Đang xem xét", 
        className: "bg-blue-50 text-blue-600 ring-blue-500/20", 
        icon: <Info size={12} /> 
      },
      INTERVIEW: { 
        label: "Mời phỏng vấn", 
        className: "bg-purple-50 text-purple-600 ring-purple-500/20", 
        icon: <Calendar size={12} /> 
      },
      ACCEPTED: { 
        label: "Được nhận", 
        className: "bg-emerald-50 text-emerald-600 ring-emerald-500/20", 
        icon: <CheckCircle2 size={12} /> 
      },
      REJECTED: { 
        label: "Từ chối", 
        className: "bg-rose-50 text-rose-600 ring-rose-500/20", 
        icon: <XCircle size={12} /> 
      },
    };
    return configs[status] || { label: status, className: "bg-slate-50 text-slate-500", icon: null };
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Cơ hội đã ứng tuyển</h1>
          <p className="text-slate-500 font-medium italic mt-1">Theo dõi trạng thái các đơn ứng tuyển của bạn.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="text-center px-4 border-r border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng số</p>
              <p className="text-xl font-black text-slate-900">{applications?.length || 0}</p>
           </div>
           <div className="text-center px-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tháng này</p>
              <p className="text-xl font-black text-primary">{applications?.filter((a: any) => new Date(a.applyDate).getMonth() === new Date().getMonth()).length}</p>
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={48}/>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang truy xuất dữ liệu ứng tuyển...</p>
        </div>
      ) : applications?.length === 0 ? (
        <Card className="border-dashed border-2 py-32 text-center rounded-[3rem] bg-white shadow-inner">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="text-slate-200" size={40} />
          </div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-lg">Hành trình chưa bắt đầu</p>
          <p className="text-slate-400 font-medium mt-2 italic">Hãy tìm kiếm và ứng tuyển vào những công việc mơ ước ngay!</p>
          <Link to="/jobs">
            <Button className="mt-8 rounded-full bg-primary hover:bg-primary/90 font-black px-8 uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">Khám phá việc làm ngay</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications?.map((app: any) => {
            const config = getStatusConfig(app.status);
            return (
              <Card key={app.id} className="rounded-3xl border-transparent shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Job Info Section */}
                    <div className="flex-1 p-6 md:p-8 flex items-start gap-6 border-b lg:border-b-0 lg:border-r border-slate-50">
                       <div className="w-16 h-16 rounded-2xl border border-slate-100 bg-white flex items-center justify-center p-2 shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                          {app.job.company.logoUrl ? (
                            <img src={app.job.company.logoUrl} alt="logo" className="w-full h-full object-contain" />
                          ) : <Building2 className="text-slate-200" size={32} />}
                       </div>
                       <div className="min-w-0 flex-1">
                          <Link to={`/jobs/${app.jobId}`} className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1 block leading-none mb-2">
                             {app.job.title}
                          </Link>
                          <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                             <Building2 size={12} className="text-primary" /> {app.job.company.name}
                          </div>
                          
                          <div className="mt-6 flex flex-wrap gap-4">
                             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <Calendar size={12} /> {new Date(app.applyDate).toLocaleDateString('vi-VN')}
                             </div>
                             <a 
                                href={app.resume.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                             >
                                <FileText size={12} /> Xem CV đã nộp
                             </a>
                          </div>
                       </div>
                    </div>

                    {/* Status & Actions Section */}
                    <div className="w-full lg:w-64 p-6 md:p-8 bg-slate-50/50 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-6">
                       <div className="text-center lg:w-full">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 hidden lg:block">Trạng thái hồ sơ</p>
                          <Badge className={cn("px-4 py-2 rounded-full border-none ring-1 shadow-sm gap-2 font-black text-[10px] uppercase tracking-widest", config.className)}>
                             {config.icon} {config.label}
                          </Badge>
                       </div>
                       
                       <Link to={`/jobs/${app.jobId}`} className="lg:w-full">
                          <Button variant="ghost" className="w-full rounded-2xl h-12 gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-primary transition-all">
                             Chi tiết việc <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </Button>
                       </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

import { useMyApplications } from "../../application/api/application.api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Calendar, FileText, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const MyApplicationsPage = () => {
  const { data: applications, isLoading } = useMyApplications();

  const getStatusStyle = (status: string) => {
    const styles: any = {
      PENDING: "bg-yellow-50 text-yellow-600 ring-yellow-500/20",
      INTERVIEW: "bg-blue-50 text-blue-600 ring-blue-500/20",
      ACCEPTED: "bg-green-50 text-green-600 ring-green-500/20",
      REJECTED: "bg-red-50 text-red-600 ring-red-500/20",
    };
    return cn("border-none ring-1 px-3 font-black text-[10px]", styles[status] || "bg-slate-50 text-slate-500");
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#001529] uppercase tracking-tight">Việc làm đã ứng tuyển</h1>
        <p className="text-slate-500 font-medium italic">Theo dõi hành trình chinh phục sự nghiệp của bạn.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#00b14f]" size={40}/></div>
      ) : applications?.length === 0 ? (
        <Card className="border-dashed border-2 py-24 text-center rounded-[2rem] bg-white">
          <Info className="mx-auto text-slate-200 mb-4" size={64} />
          <p className="text-slate-400 font-black uppercase tracking-widest">Bạn chưa nộp đơn vào công việc nào.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications?.map((app: any) => (
            <Card key={app.id} className="rounded-2xl border-slate-100 hover:shadow-md transition-all group">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl border flex items-center justify-center shrink-0">
                    <Briefcase size={24} className="text-[#001529]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 uppercase text-sm group-hover:text-[#00b14f] transition-colors">{app.job.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase mt-1">
                      <Building2 size={12} /> {app.job.company.name}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Ngày nộp đơn</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Calendar size={14} /> {new Date(app.applyDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  <div className="text-center md:text-right min-w-[120px]">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Trạng thái hồ sơ</p>
                    <Badge className={getStatusStyle(app.status)}>{app.status}</Badge>
                  </div>

                  <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                    <FileText size={16} className="text-slate-300" />
                    <a href={app.resume.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-500 hover:underline uppercase">Xem CV đã nộp</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
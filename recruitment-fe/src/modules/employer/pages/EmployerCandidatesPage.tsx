import { useState } from "react";
import { useEmployerApplications, applicationApi } from "../../application/api/application.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, Check, X, Mail, Phone, Loader2, UserSearch, Info, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleInterviewModal } from "../../interview/components/ScheduleInterviewModal";

export const EmployerCandidatesPage = () => {
  const { data: apps, isLoading } = useEmployerApplications();
  const queryClient = useQueryClient();

  const [selectedApp, setSelectedApp] = useState<{ id: string, name: string } | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    const toastId = toast.loading("Đang cập nhật trạng thái...");
    try {
      await applicationApi.updateStatus(id, { status });
      toast.success("Cập nhật trạng thái thành công", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
    } catch (error) {
      toast.error("Thao tác thất bại", { id: toastId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return "bg-yellow-50 text-yellow-600 ring-yellow-500/20";
      case 'REVIEWING': return "bg-purple-50 text-purple-600 ring-purple-500/20";
      case 'INTERVIEW': return "bg-blue-50 text-blue-600 ring-blue-500/20";
      case 'ACCEPTED': return "bg-green-50 text-green-600 ring-green-500/20";
      case 'REJECTED': return "bg-red-50 text-red-600 ring-red-500/20";
      default: return "bg-slate-50 text-slate-500";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#001529] uppercase tracking-tight border-l-4 border-[#00b14f] pl-4">Danh sách ứng tuyển</h1>
          <p className="text-slate-500 text-sm font-medium ml-4 italic">Đánh giá và lựa chọn nhân tài phù hợp cho công ty.</p>
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl border shadow-sm flex items-center gap-3">
          <UserSearch className="text-[#00b14f]" size={20} />
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{apps?.length || 0} Ứng viên</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-black text-[#001529] px-8 py-5 uppercase text-xs tracking-widest">Ứng viên</TableHead>
              <TableHead className="font-black text-[#001529] uppercase text-xs tracking-widest">Vị trí</TableHead>
              <TableHead className="font-black text-[#001529] text-center uppercase text-xs tracking-widest">Hồ sơ</TableHead>
              <TableHead className="font-black text-[#001529] text-center uppercase text-xs tracking-widest">Trạng thái</TableHead>
              <TableHead className="font-black text-[#001529] text-right px-8 uppercase text-xs tracking-widest">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#00b14f]" size={32}/></TableCell></TableRow>
            ) : !apps || apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24 text-slate-400">
                    <Info className="mx-auto mb-2 opacity-20" size={48} />
                    <p className="font-black uppercase tracking-widest text-xs">Hiện tại chưa có ai ứng tuyển vào công ty của bạn.</p>
                </TableCell>
              </TableRow>
            ) : (
              apps.map((app: any) => (
                <TableRow key={app.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={app.candidate.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-green-100 text-[#00b14f] font-black">{app.candidate.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">{app.candidate.fullName}</p>
                        <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
                          <span className="flex items-center gap-1.5"><Mail size={10} className="text-slate-300"/> {app.candidate.email}</span>
                          <span className="flex items-center gap-1.5"><Phone size={10} className="text-slate-300"/> {app.candidate.phone || "CHƯA CẬP NHẬT"}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-black text-slate-700 text-[10px] uppercase tracking-wide leading-tight max-w-[150px]">{app.job.title}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" asChild className="rounded-xl border-blue-100 text-blue-600 hover:bg-blue-50 font-black text-[10px] uppercase tracking-widest h-8 px-4">
                      <a href={app.resume.fileUrl} target="_blank" rel="noreferrer"><ExternalLink size={12} className="mr-1.5"/> Mở CV</a>
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                     <Badge className={cn("font-black text-[9px] px-3 ring-1 border-none uppercase", getStatusColor(app.status))}>
                        {app.status === 'PENDING' ? 'Mới nộp' : 
                         app.status === 'REVIEWING' ? 'Đang xem' : 
                         app.status === 'INTERVIEW' ? 'Phỏng vấn' : app.status}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    {app.status === 'REVIEWING' || app.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:bg-red-50 rounded-xl h-9 w-9 shadow-sm" 
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        >
                            <X size={18}/>
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-blue-500 hover:bg-blue-50 rounded-xl h-9 w-9 shadow-sm" 
                          onClick={() => setSelectedApp({ id: app.id, name: app.candidate.fullName })}
                        >
                            <CalendarClock size={18}/>
                        </Button>
                      </div>
                    ) : app.status === 'INTERVIEW' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-xl border-green-100 text-green-600 hover:bg-green-50 font-black text-[9px] uppercase h-8 px-3"
                          onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                        >
                            <Check size={14} className="mr-1"/> Nhận việc
                        </Button>
                    ) : (
                      <span className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest px-2">Đã xử lý</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedApp && (
        <ScheduleInterviewModal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          applicationId={selectedApp.id}
          candidateName={selectedApp.name}
        />
      )}
    </div>
  );
};
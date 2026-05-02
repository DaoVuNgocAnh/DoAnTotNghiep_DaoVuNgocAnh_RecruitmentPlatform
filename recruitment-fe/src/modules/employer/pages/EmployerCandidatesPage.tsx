import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useEmployerApplications, applicationApi } from "../../application/api/application.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, Check, X, Mail, Phone, Loader2, UserSearch, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleInterviewModal } from "../../interview/components/ScheduleInterviewModal";
import { SaveButton } from "@/modules/saved-items/components/SaveButton";

export const EmployerCandidatesPage = () => {
  const { data: apps, isLoading } = useEmployerApplications();
  const queryClient = useQueryClient();

  const [selectedApp, setSelectedApp] = useState<{ id: string, name: string } | null>(null);

  // --- LOGIC NHÓM DỮ LIỆU ---
  const groupedCandidates = useMemo(() => {
    if (!apps) return [];

    const groups = apps.reduce((acc: any, app: any) => {
      const candidateId = app.candidate.id;
      if (!acc[candidateId]) {
        acc[candidateId] = {
          candidate: app.candidate,
          appliedJobs: [],
        };
      }
      acc[candidateId].appliedJobs.push({
        applicationId: app.id,
        jobTitle: app.job.title,
        status: app.status,
        resume: app.resume,
      });
      return acc;
    }, {});

    return Object.values(groups);
  }, [apps]);

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
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{groupedCandidates.length} Ứng viên</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent uppercase text-[11px] tracking-widest font-black">
              <TableHead className="font-black text-[#001529] px-8 py-5">Ứng viên</TableHead>
              <TableHead className="font-black text-[#001529]">Vị trí ứng tuyển</TableHead>
              <TableHead className="font-black text-[#001529] text-center">Hồ sơ</TableHead>
              <TableHead className="font-black text-[#001529] text-center">Trạng thái</TableHead>
              <TableHead className="font-black text-[#001529] text-right px-8">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#00b14f]" size={32}/></TableCell></TableRow>
            ) : groupedCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Hiện tại chưa có ai ứng tuyển.
                </TableCell>
              </TableRow>
            ) : (
              groupedCandidates.map((group: any) => (
                <TableRow key={group.candidate.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                  {/* CỘT 1: ỨNG VIÊN */}
                  <TableCell className="px-8 py-6 align-top w-[300px]">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                          <AvatarImage src={group.candidate.avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-green-100 text-[#00b14f] font-black text-xl">{group.candidate.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 z-10">
                          <SaveButton 
                            targetId={group.candidate.id} 
                            targetType="CANDIDATE" 
                            className="h-7 w-7 bg-white shadow-sm border border-slate-100"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <Link to={`/employer/candidates/${group.candidate.id}`} className="font-black text-slate-900 text-sm truncate uppercase tracking-tight hover:text-[#00b14f] transition-colors">{group.candidate.fullName}</Link>
                        <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
                          <span className="flex items-center gap-1.5"><Mail size={10} className="text-slate-300"/> {group.candidate.email}</span>
                          <span className="flex items-center gap-1.5"><Phone size={10} className="text-slate-300"/> {group.candidate.phone || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* CỘT 2: VỊ TRÍ */}
                  <TableCell className="p-0 align-top">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-16 flex items-center px-4">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#00b14f] shrink-0" />
                             <p className="font-bold text-slate-700 text-xs uppercase truncate max-w-[200px]">{job.jobTitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* CỘT 3: HỒ SƠ */}
                  <TableCell className="p-0 align-top">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-16 flex items-center justify-center px-4">
                          <Button variant="ghost" size="sm" asChild className="h-8 text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase gap-1.5 px-3 hover:bg-blue-50 rounded-lg">
                            <a href={job.resume.fileUrl} target="_blank" rel="noreferrer"><ExternalLink size={14}/> CV</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* CỘT 4: TRẠNG THÁI */}
                  <TableCell className="p-0 align-top">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-16 flex items-center justify-center px-4">
                          <Badge className={cn("font-black text-[9px] px-3 ring-1 border-none uppercase min-w-[90px] justify-center", getStatusColor(job.status))}>
                             {job.status === 'PENDING' ? 'Mới nộp' : 
                              job.status === 'REVIEWING' ? 'Đang xem' : 
                              job.status === 'INTERVIEW' ? 'Phỏng vấn' : job.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* CỘT 5: THAO TÁC */}
                  <TableCell className="p-0 align-top px-8">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-16 flex items-center justify-end gap-2">
                          {job.status === 'REVIEWING' || job.status === 'PENDING' ? (
                            <>
                              <Button 
                                size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl h-8 w-8" 
                                onClick={() => handleUpdateStatus(job.applicationId, 'REJECTED')}
                              >
                                  <X size={16}/>
                              </Button>
                              <Button 
                                size="icon" variant="ghost" className="text-blue-500 hover:bg-blue-50 rounded-xl h-8 w-8" 
                                onClick={() => setSelectedApp({ id: job.applicationId, name: group.candidate.fullName })}
                              >
                                  <CalendarClock size={16}/>
                              </Button>
                            </>
                          ) : job.status === 'INTERVIEW' ? (
                              <Button 
                                size="sm" variant="outline" className="rounded-xl border-green-100 text-green-600 hover:bg-green-50 font-black text-[9px] uppercase h-7 px-2"
                                onClick={() => handleUpdateStatus(job.applicationId, 'ACCEPTED')}
                              >
                                  <Check size={14} className="mr-1"/> Nhận việc
                              </Button>
                          ) : (
                            <span className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest px-2">Đã xong</span>
                          )}
                        </div>
                      ))}
                    </div>
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
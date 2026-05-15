import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Check, ExternalLink, History, Loader2, Mail, MessageSquareText, Phone, UserSearch, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SaveButton } from "@/modules/saved-items/components/SaveButton";
import { useToggleCompanyCandidate } from "@/modules/saved-items/hooks/useSavedItems";
import { useUser } from "@/modules/user/hooks/useUser";
import { applicationApi, useEmployerApplications } from "../../application/api/application.api";
import { ScheduleInterviewModal } from "../../interview/components/ScheduleInterviewModal";
import { Pagination } from "@/components/shared/Pagination";
import { Textarea } from "@/components/ui/textarea";

export const EmployerCandidatesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: apps, isLoading } = useEmployerApplications({ page, limit });
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const toggleCompanyCandidate = useToggleCompanyCandidate();
  const [selectedApp, setSelectedApp] = useState<{ id: string; name: string } | null>(null);
  const [historyDialog, setHistoryDialog] = useState<{ title: string; histories: any[] } | null>(null);
  
  // New state for status update with note
  const [statusUpdate, setStatusUpdate] = useState<{ id: string; status: string; name: string } | null>(null);
  const [employerNote, setEmployerNote] = useState("");

  const groupedCandidates = useMemo(() => {
    if (!apps?.data) return [];

    const groups = apps.data.reduce((acc: any, app: any) => {
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
        candidateNote: app.candidateNote,
        employerActionBy: app.employerActionBy,
        employerActionDate: app.employerActionDate,
        histories: app.histories || [],
      });

      return acc;
    }, {});

    return Object.values(groups);
  }, [apps]);

  const handleUpdateStatus = async () => {
    if (!statusUpdate) return;
    
    const toastId = toast.loading("Đang cập nhật trạng thái...");
    try {
      await applicationApi.updateStatus(statusUpdate.id, { 
        status: statusUpdate.status, 
        employerNote 
      });
      toast.success("Cập nhật trạng thái thành công", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["employer-applications"] });
      setStatusUpdate(null);
      setEmployerNote("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Thao tác thất bại", { id: toastId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-600 ring-yellow-500/20";
      case "REVIEWING":
        return "bg-purple-50 text-purple-600 ring-purple-500/20";
      case "INTERVIEW":
        return "bg-blue-50 text-blue-600 ring-blue-500/20";
      case "ACCEPTED":
        return "bg-green-50 text-green-600 ring-green-500/20";
      case "REJECTED":
        return "bg-red-50 text-red-500 ring-red-500/20";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Mới nộp",
      REVIEWING: "Đang xem",
      INTERVIEW: "Phỏng vấn",
      ACCEPTED: "Đã nhận",
      REJECTED: "Từ chối",
      WITHDRAWN: "Đã rút",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#001529] uppercase tracking-tight border-l-4 border-[#00b14f] pl-4">
            Danh sách ứng tuyển
          </h1>
          <p className="text-slate-500 text-sm font-medium ml-4 italic">
            {user?.isOwner
              ? "Owner đang xem toàn bộ hồ sơ ứng tuyển của công ty."
              : "Bạn đang xem hồ sơ thuộc các job được phân công."}
          </p>
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl border shadow-sm flex items-center gap-3">
          <UserSearch className="text-[#00b14f]" size={20} />
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">
            {apps?.meta?.total || 0} ứng viên
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent uppercase text-[11px] tracking-widest font-black">
              <TableHead className="font-black text-[#001529] px-8 py-5">Ứng viên</TableHead>
              <TableHead className="font-black text-[#001529]">Vị trí</TableHead>
              <TableHead className="font-black text-[#001529] text-center">Hồ sơ</TableHead>
              <TableHead className="font-black text-[#001529] text-center">Trạng thái</TableHead>
              <TableHead className="font-black text-[#001529]">Xử lý gần nhất</TableHead>
              <TableHead className="font-black text-[#001529] text-right px-8">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-[#00b14f]" size={32} />
                </TableCell>
              </TableRow>
            ) : groupedCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Hiện tại chưa có ai ứng tuyển.
                </TableCell>
              </TableRow>
            ) : (
              groupedCandidates.map((group: any) => (
                <TableRow key={group.candidate.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                  <TableCell className="px-8 py-6 align-top w-[300px]">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                          <AvatarImage src={group.candidate.avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-green-100 text-[#00b14f] font-black text-xl">
                            {group.candidate.fullName.charAt(0)}
                          </AvatarFallback>
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
                        <Link
                          to={`/employer/candidates/${group.candidate.id}`}
                          className="font-black text-slate-900 text-sm truncate uppercase tracking-tight hover:text-[#00b14f] transition-colors"
                        >
                          {group.candidate.fullName}
                        </Link>
                        <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
                          <span className="flex items-center gap-1.5">
                            <Mail size={10} className="text-slate-300" /> {group.candidate.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone size={10} className="text-slate-300" /> {group.candidate.phone || "N/A"}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 h-7 w-fit rounded-xl px-2 text-[9px] font-black uppercase"
                            onClick={() => toggleCompanyCandidate.mutate(group.candidate.id)}
                          >
                            Kho công ty
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-0 align-top">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-20 flex items-center px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00b14f] shrink-0" />
                            <p className="font-bold text-slate-700 text-xs uppercase truncate max-w-[200px]">
                              {job.jobTitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="p-0 align-top">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-20 flex items-center justify-center px-4 gap-2">
                          <Button variant="ghost" size="sm" asChild className="h-8 text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase gap-1.5 px-3 hover:bg-blue-50 rounded-lg">
                            <a href={job.resume.fileUrl} target="_blank" rel="noreferrer">
                              <ExternalLink size={14} /> CV
                            </a>
                          </Button>
                          {job.candidateNote && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 text-amber-600 hover:text-amber-700 font-black text-[10px] uppercase gap-1.5 px-3 hover:bg-amber-50 rounded-lg">
                                  <MessageSquareText size={14} /> Thư
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-3xl max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-lg font-black uppercase text-slate-900 tracking-tight">Thư giới thiệu từ ứng viên</DialogTitle>
                                </DialogHeader>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                  <p className="text-sm font-medium text-slate-600 leading-relaxed italic whitespace-pre-wrap">
                                    "{job.candidateNote}"
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                  <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={group.candidate.avatarUrl} />
                                    <AvatarFallback>{group.candidate.fullName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase">{group.candidate.fullName}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Ứng viên</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="p-0 align-top">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-20 flex items-center justify-center px-4">
                          <Badge className={cn("font-black text-[9px] px-3 ring-1 border-none uppercase min-w-[90px] justify-center", getStatusColor(job.status))}>
                            {getStatusLabel(job.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="p-0 align-top min-w-[220px]">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => {
                        const latestHistory = job.histories?.[0];
                        return (
                          <div key={job.applicationId} className="h-20 flex flex-col justify-center px-4">
                            {job.employerActionBy ? (
                              <>
                                <p className="text-xs font-black text-slate-700 truncate">
                                  {job.employerActionBy.fullName || job.employerActionBy.email}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400">
                                  {job.employerActionDate
                                    ? new Date(job.employerActionDate).toLocaleString("vi-VN")
                                    : "Chưa có thời gian"}
                                </p>
                                {latestHistory && (
                                  <button
                                    type="button"
                                    className="mt-1 flex items-center gap-1 text-[10px] font-black text-[#00b14f] hover:underline"
                                    onClick={() => setHistoryDialog({ title: job.jobTitle, histories: job.histories || [] })}
                                  >
                                    <History size={11} />
                                    Xem lịch sử ({job.histories?.length || 0})
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                Chưa thao tác
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>

                  <TableCell className="p-0 align-top px-8">
                    <div className="flex flex-col divide-y divide-slate-50">
                      {group.appliedJobs.map((job: any) => (
                        <div key={job.applicationId} className="h-20 flex items-center justify-end gap-2">
                          {job.status === "REVIEWING" || job.status === "PENDING" ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50 rounded-xl h-8 w-8"
                                onClick={() => setStatusUpdate({ id: job.applicationId, status: "REJECTED", name: group.candidate.fullName })}
                              >
                                <X size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-blue-500 hover:bg-blue-50 rounded-xl h-8 w-8"
                                onClick={() => setSelectedApp({ id: job.applicationId, name: group.candidate.fullName })}
                              >
                                <CalendarClock size={16} />
                              </Button>
                            </>
                          ) : job.status === "INTERVIEW" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 font-black text-[9px] uppercase h-7 px-2"
                                onClick={() => setStatusUpdate({ id: job.applicationId, status: "REJECTED", name: group.candidate.fullName })}
                              >
                                <X size={14} className="mr-1" /> Từ chối
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl border-green-100 text-green-600 hover:bg-green-50 font-black text-[9px] uppercase h-7 px-2"
                                onClick={() => setStatusUpdate({ id: job.applicationId, status: "ACCEPTED", name: group.candidate.fullName })}
                              >
                                <Check size={14} className="mr-1" /> Nhận việc
                              </Button>
                            </>
                          ) : (
                            <span className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest px-2">
                              Đã xong
                            </span>
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

        {apps && (
          <div className="p-4 border-t border-slate-50">
            <Pagination
              currentPage={page}
              totalPages={apps.meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {selectedApp && (
        <ScheduleInterviewModal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          applicationId={selectedApp.id}
          candidateName={selectedApp.name}
        />
      )}

      {/* Dialog for updating status with note */}
      <Dialog open={!!statusUpdate} onOpenChange={(open) => !open && setStatusUpdate(null)}>
        <DialogContent className="rounded-[2rem] max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase text-[#001529]">
              {statusUpdate?.status === "REJECTED" ? "Từ chối hồ sơ" : "Tiếp nhận ứng viên"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Avatar className="h-10 w-10 rounded-xl">
                   <AvatarFallback className="bg-[#00b14f] text-white font-black uppercase">
                      {statusUpdate?.name.charAt(0)}
                   </AvatarFallback>
                </Avatar>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ứng viên</p>
                   <p className="text-sm font-black text-slate-700 uppercase">{statusUpdate?.name}</p>
                </div>
             </div>

             <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lý do / Ghi chú cho ứng viên:</p>
                <Textarea 
                   placeholder={statusUpdate?.status === "REJECTED" ? "Nhập lý do từ chối (ví dụ: Kỹ năng chưa phù hợp...)" : "Nhập lời chào mừng hoặc ghi chú tiếp nhận..."}
                   className="rounded-2xl border-slate-100 focus:border-[#00b14f] min-h-[120px] text-sm font-medium"
                   value={employerNote}
                   onChange={(e) => setEmployerNote(e.target.value)}
                />
                <p className="text-[9px] text-slate-400 italic font-medium">Ghi chú này sẽ được gửi đến ứng viên để họ hiểu rõ hơn về quyết định của bạn.</p>
             </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
             <Button 
                variant="ghost" 
                className="rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400"
                onClick={() => setStatusUpdate(null)}
             >
                Hủy bỏ
             </Button>
             <Button 
                className={cn(
                   "rounded-xl font-black text-[10px] uppercase tracking-widest px-6 shadow-lg",
                   statusUpdate?.status === "REJECTED" ? "bg-rose-500 hover:bg-rose-600 shadow-rose-100" : "bg-[#00b14f] hover:bg-[#009643] shadow-green-100"
                )}
                onClick={handleUpdateStatus}
             >
                Xác nhận
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!historyDialog} onOpenChange={() => setHistoryDialog(null)}>
        <DialogContent className="max-w-xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase text-slate-900">
              Lịch sử xử lý
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-500">{historyDialog?.title}</p>
            {historyDialog?.histories?.length ? (
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
                {historyDialog.histories.map((item: any) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-black text-slate-800">
                        {item.actor?.fullName || item.actor?.email}
                      </p>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {item.oldStatus && (
                        <Badge className={cn("border-none ring-1", getStatusColor(item.oldStatus))}>
                          {getStatusLabel(item.oldStatus)}
                        </Badge>
                      )}
                      <span className="text-slate-300">→</span>
                      <Badge className={cn("border-none ring-1", getStatusColor(item.newStatus))}>
                        {getStatusLabel(item.newStatus)}
                      </Badge>
                    </div>
                    {item.note && <p className="mt-3 text-sm text-slate-600">{item.note}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-bold text-slate-400">
                Chưa có lịch sử xử lý.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

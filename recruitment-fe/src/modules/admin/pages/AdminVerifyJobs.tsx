import { useState } from 'react';
import { useAdminJobs, jobApi, type Job } from "../../job/api/job.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Building2, Calendar, Loader2, Info, AlertCircle, ShieldCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatSalary } from "@/lib/utils";
import { Pagination } from '@/components/shared/Pagination';

export const AdminVerifyJobs = () => {
  const [currentStatus, setCurrentStatus] = useState<string>('PENDING');
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data: jobsData, isLoading } = useAdminJobs({ 
    status: currentStatus === 'ALL' ? undefined : currentStatus,
    page,
    limit
  });
  const queryClient = useQueryClient();

  const jobs = jobsData?.data || [];
  const meta = jobsData?.meta;

  const handleVerify = async (id: string, status: string) => {
    const toastId = toast.loading("Đang cập nhật trạng thái...");
    try {
      await jobApi.updateJobStatusAdmin(id, status);
      const message = status === 'ACTIVE' ? "Đã duyệt tin thành công" : "Đã gỡ/từ chối tin thành công";
      toast.success(message, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    } catch {
      toast.error("Cập nhật thất bại", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Duyệt tin tuyển dụng</h1>
          <p className="text-zinc-500 text-sm font-medium italic">Hệ thống phân loại tin tự động: Thường - Nổi bật - Uy tín.</p>
        </div>
        
        <Tabs value={currentStatus} onValueChange={(val) => { setCurrentStatus(val); setPage(1); }} className="w-fit">
          <TabsList className="bg-zinc-100 p-1 rounded-xl">
            <TabsTrigger value="ALL" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">TẤT CẢ</TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">CHỜ DUYỆT</TabsTrigger>
            <TabsTrigger value="ACTIVE" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">ĐANG HIỆN</TabsTrigger>
            <TabsTrigger value="REJECTED" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">TỪ CHỐI</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-black text-zinc-800 px-8 py-5">Doanh nghiệp</TableHead>
              <TableHead className="font-black text-zinc-800">Thông tin tuyển dụng</TableHead>
              <TableHead className="font-black text-zinc-800 text-center">Loại đối tác</TableHead>
              <TableHead className="font-black text-zinc-800 text-center">Trạng thái</TableHead>
              <TableHead className="font-black text-zinc-800 text-right px-8">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!jobs || jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-zinc-400">
                  <Info className="mx-auto mb-2 opacity-20" size={48} />
                  Hiện không có tin tuyển dụng nào trong danh mục này.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job: Job) => (
                <TableRow key={job.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="px-8 py-5 font-black text-blue-600 uppercase text-[11px] tracking-widest">
                    <div className="flex items-center gap-2">
                       <Building2 size={14} className="text-zinc-400" /> 
                       {job.company?.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-zinc-900 leading-tight mb-1 line-clamp-1">{job.title}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                      <span className="text-emerald-600">Lương: {formatSalary(job.salaryMin, job.salaryMax, job.isSalaryNegotiable)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12}/> {job.expiredDate ? new Date(job.expiredDate).toLocaleDateString('vi-VN') : "Vô thời hạn"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {job.company?.isPremium ? (
                      <Badge className="bg-amber-50 text-amber-600 border-amber-200 font-black text-[9px] uppercase tracking-tighter px-2 py-0.5 rounded-full shadow-sm">
                        <ShieldCheck size={10} className="mr-1" /> Đối tác Uy tín
                      </Badge>
                    ) : (
                      <span className="text-zinc-300 text-[10px] font-bold">Tiêu chuẩn</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "border-none px-3 font-black text-[10px] gap-1",
                      job.status === 'PENDING' ? "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200" :
                      job.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" :
                      job.status === 'CLOSED' ? "bg-zinc-50 text-zinc-600 ring-1 ring-zinc-200" :
                      "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                    )}>
                      {job.status === 'PENDING' && <AlertCircle size={10} />}
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      {job.status === 'PENDING' ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:bg-red-50 font-bold rounded-xl h-9 px-4"
                            onClick={() => handleVerify(job.id, 'REJECTED')}
                          >
                            <X size={16} className="mr-1"/> Từ chối
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 h-9 px-4"
                            onClick={() => handleVerify(job.id, 'ACTIVE')}
                          >
                            <Check size={16} className="mr-1"/> Duyệt tin
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-zinc-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-xl h-9 px-4"
                          onClick={() => handleVerify(job.id, job.status === 'ACTIVE' ? 'REJECTED' : 'ACTIVE')}
                        >
                          {job.status === 'ACTIVE' ? 'Gỡ tin' : 'Khôi phục'}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && (
        <Pagination 
          currentPage={page} 
          totalPages={meta.totalPages} 
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

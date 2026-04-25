import { useAdminJobs, jobApi } from "../../job/api/job.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Đã sử dụng bên dưới
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Building2, Calendar, Loader2, Info, AlertCircle } from "lucide-react";

export const AdminVerifyJobs = () => {
  const { data: jobs, isLoading } = useAdminJobs('PENDING');
  const queryClient = useQueryClient();

  const handleVerify = async (id: string, status: string) => {
    const toastId = toast.loading("Đang cập nhật trạng thái...");
    try {
      await jobApi.updateJobStatusAdmin(id, status);
      toast.success(status === 'ACTIVE' ? "Đã duyệt tin thành công" : "Đã từ chối tin", { id: toastId });
      
      // Làm mới danh sách duyệt của Admin
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      // Làm mới danh sách việc làm ngoài trang chủ
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi hệ thống khi cập nhật", { id: toastId });
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
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Phê duyệt tin tuyển dụng</h1>
        <p className="text-zinc-500 text-sm font-medium italic">Hệ thống kiểm soát chất lượng nội dung SmartCV.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-black text-zinc-800 px-8 py-5">Doanh nghiệp</TableHead>
              <TableHead className="font-black text-zinc-800">Thông tin tuyển dụng</TableHead>
              <TableHead className="font-black text-zinc-800 text-center">Trạng thái</TableHead>
              <TableHead className="font-black text-zinc-800 text-right px-8">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!jobs || jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-zinc-400">
                  <Info className="mx-auto mb-2 opacity-20" size={48} />
                  Hiện không có tin tuyển dụng nào đang chờ duyệt.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job: any) => (
                <TableRow key={job.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="px-8 py-5 font-black text-blue-600 uppercase text-[11px] tracking-widest">
                    <div className="flex items-center gap-2">
                       <Building2 size={14} className="text-zinc-400" /> 
                       {job.company?.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-zinc-900 leading-tight mb-1">{job.title}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                      <span className="text-blue-500">Lương: {job.salary}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12}/> Hạn: {job.expiredDate ? new Date(job.expiredDate).toLocaleDateString('vi-VN') : "Vô thời hạn"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {/* SỬ DỤNG BADGE TẠI ĐÂY ĐỂ FIX LỖI TS */}
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-3 font-black text-[10px] gap-1">
                      <AlertCircle size={10} /> PENDING
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8 space-x-2">
                    <div className="flex justify-end gap-2">
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
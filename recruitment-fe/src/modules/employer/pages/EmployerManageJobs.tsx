import { useMyJobs, jobApi } from "../../job/api/job.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, PowerOff, Loader2, Plus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const EmployerManageJobs = () => {
  const { data: jobs, isLoading } = useMyJobs();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleClose = async (id: string) => {
    try {
      await jobApi.closeJob(id);
      toast.success("Đã đóng tin tuyển dụng thành công");
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    } catch (error) {
      toast.error("Không thể thao tác đóng tin");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      ACTIVE: "bg-green-100 text-green-700 ring-green-600/20",
      PENDING: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
      CLOSED: "bg-slate-100 text-slate-500 ring-slate-400/20",
      REJECTED: "bg-red-100 text-red-700 ring-red-600/20",
    };
    return (
      <Badge className={cn("border-none ring-1 px-3 font-bold", styles[status] || styles.CLOSED)}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight border-l-4 border-[#00b14f] pl-4">Kho tin tuyển dụng</h1>
          <p className="text-slate-500 text-sm font-medium ml-4">Quản lý trạng thái và thời hạn các vị trí đang đăng tuyển.</p>
        </div>
        <Button 
          onClick={() => navigate('/employer/jobs/create')} // Sửa path nếu cần
          className="bg-[#00b14f] hover:bg-[#009643] rounded-2xl gap-2 font-black shadow-lg shadow-green-100"
        >
          <Plus size={20} /> ĐĂNG TIN MỚI
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-black text-slate-800 px-8 py-5">Vị trí tuyển dụng</TableHead>
              <TableHead className="font-black text-slate-800 text-center">Trạng thái</TableHead>
              <TableHead className="font-black text-slate-800 text-center">Hạn nộp</TableHead>
              <TableHead className="font-black text-slate-800 text-right px-8">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#00b14f]" size={32}/></TableCell></TableRow>
            ) : jobs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-slate-400">
                  <Info className="mx-auto mb-2 opacity-20" size={48} />
                  Bạn chưa có tin tuyển dụng nào.
                </TableCell>
              </TableRow>
            ) : (
              jobs?.map((job: any) => (
                <TableRow key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="px-8 py-5">
                    <p className="font-bold text-slate-900 leading-tight mb-1">{job.title}</p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
                       <span>{job.category.name}</span>
                       <span>Lương: {job.salary}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(job.status)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-500 text-xs">
                    <div className="flex items-center justify-center gap-2 bg-slate-100 py-1 rounded-lg w-fit mx-auto px-2">
                       <Calendar size={14} className="text-[#00b14f]"/>
                       {job.expiredDate ? new Date(job.expiredDate).toLocaleDateString('vi-VN') : "Vô thời hạn"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    {job.status === 'ACTIVE' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-50 gap-2 font-bold rounded-xl"
                        onClick={() => handleClose(job.id)}
                      >
                        <PowerOff size={16}/> Đóng tin
                      </Button>
                    )}
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
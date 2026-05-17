import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface UpdateStatusDialogProps {
  statusUpdate: { id: string; status: string; name: string } | null;
  setStatusUpdate: (val: any) => void;
  employerNote: string;
  setEmployerNote: (val: string) => void;
  handleUpdateStatus: () => Promise<void>;
}

export const UpdateStatusDialog = ({
  statusUpdate,
  setStatusUpdate,
  employerNote,
  setEmployerNote,
  handleUpdateStatus,
}: UpdateStatusDialogProps) => {
  return (
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
  );
};

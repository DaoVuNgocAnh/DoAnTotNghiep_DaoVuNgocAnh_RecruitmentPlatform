import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface HistoryDialogProps {
  historyDialog: { title: string; histories: any[] } | null;
  setHistoryDialog: (val: any) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const HistoryDialog = ({
  historyDialog,
  setHistoryDialog,
  getStatusColor,
  getStatusLabel,
}: HistoryDialogProps) => {
  return (
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
  );
};

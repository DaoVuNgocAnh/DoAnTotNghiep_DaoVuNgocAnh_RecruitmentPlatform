import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";

export const GlobalErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 text-center border border-slate-100 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500 shadow-inner">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Đã có lỗi xảy ra</h1>
        <p className="text-slate-500 font-medium italic mb-8 leading-relaxed">
          Hệ thống gặp sự cố ngoài ý muốn. Đừng lo lắng, chúng tôi đã ghi nhận lỗi này.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chi tiết lỗi:</p>
           <p className="text-xs font-mono text-rose-600 break-all bg-white p-2 rounded-lg border border-rose-100">
             {error instanceof Error ? error.message : "Unknown Error"}
           </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={resetErrorBoundary}
            className="h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 gap-2"
          >
            <RefreshCcw size={14} /> Thử tải lại trang
          </Button>
          <Button 
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="h-12 rounded-xl text-slate-400 font-black uppercase tracking-widest text-[10px] gap-2"
          >
            <Home size={14} /> Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

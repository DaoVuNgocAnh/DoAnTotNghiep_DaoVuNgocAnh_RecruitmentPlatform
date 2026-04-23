import { useState } from 'react';
import { Hourglass, Ban, Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/modules/user/hooks/useUser'; // Dùng hook React Query
import { Badge } from '@/components/ui/badge';
import { companyApi } from '../api/company.api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query'; // Dùng để reset cache

export const JoinPendingPage = () => {
  const { data: user } = useUser(); // Lấy dữ liệu user realtime
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleCancelRequest = async () => {
    const requestId = user?.pendingJoinRequest?.id;
    if (!requestId) return;

    setLoading(true);
    try {
      // 1. Gọi API rút lại yêu cầu
      await companyApi.cancelJoinRequest(requestId);
      
      toast.success("Đã rút lại yêu cầu gia nhập");

      // 2. "Lệnh thần thánh": Ép React Query fetch lại data user mới
      // Sau khi fetch lại, pendingJoinRequest sẽ là null, EmployerGuard tự động đẩy về trang Setup
      await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể rút lại yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
      <Card className="max-w-md w-full rounded-3xl shadow-2xl border-none p-8 text-center animate-in zoom-in duration-500">
        <CardHeader className="p-0 mb-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-100">
            <Hourglass size={40} className="text-blue-500 animate-spin-slow" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">Đang đợi Sếp duyệt</CardTitle>
          
          <CardDescription className="text-base pt-2 font-medium">
            Yêu cầu gia nhập công ty <br/>
            <span className="font-black text-[#00b14f] text-lg uppercase tracking-tight">
              {user?.pendingJoinRequest?.companyName || "Đang tải..."}
            </span> 
            <br/> của bạn đang được xử lý.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-0">
          <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500 text-left space-y-3">
             <div className="flex justify-between items-center">
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Mã số thuế</span>
                <span className="font-black text-slate-700 font-mono tracking-tighter">
                  {user?.pendingJoinRequest?.taxCode || "---"}
                </span>
             </div>
             <div className="flex justify-between items-center border-t pt-3 border-slate-200">
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Trạng thái</span>
                <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-none font-black text-[10px] px-2 py-0.5">
                  WAITING FOR OWNER
                </Badge>
             </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-2">
             <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl font-black border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95"
                onClick={handleCancelRequest}
                disabled={loading}
             >
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Ban size={18} className="mr-2" />}
                RÚT LẠI YÊU CẦU GIA NHẬP
             </Button>

             <div className="flex items-center justify-center gap-2 text-slate-300 mt-2">
                <ShieldCheck size={14} />
                <p className="text-[10px] uppercase font-bold tracking-[0.2em]">
                   SmartCV Security Protection
                </p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState } from 'react';
import { Clock, ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'; // Dùng React Query
import { toast } from 'sonner';

export const PendingApprovalPage = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient(); // Bộ điều khiển cache
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      /**
       * "Lệnh thần thánh": Xóa cache cũ của user.
       * Ngay lập tức, Hook useUser() ở EmployerGuard sẽ tự động chạy lại API getMe.
       * Nếu Backend trả về VERIFIED, trang web sẽ tự nhảy vào Dashboard.
       */
      await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      
      toast.success("Đang đồng bộ dữ liệu mới nhất từ máy chủ...");
    } catch (error: any) {
      toast.error("Không thể cập nhật trạng thái lúc này.");
    } finally {
      // Delay một chút để tạo cảm giác hệ thống đang "quét" dữ liệu
      setTimeout(() => setIsChecking(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
      <Card className="max-w-md w-full rounded-3xl shadow-2xl border-none p-8 text-center animate-in fade-in zoom-in duration-500">
        <CardHeader className="p-0 mb-6">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-100">
            <Clock size={40} className="text-yellow-600 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">Đang chờ phê duyệt</CardTitle>
          <CardDescription className="text-base pt-2 font-medium">
            Hồ sơ doanh nghiệp của bạn đang được hệ thống kiểm tra mã số thuế.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-0">
          <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500 leading-relaxed font-medium">
            Quá trình này thường mất từ **12 - 24 giờ** làm việc. Chúng tôi sẽ gửi email thông báo cho bạn ngay khi hoàn tất.
          </div>
          
          <div className="flex flex-col gap-3">
             <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl gap-2 font-black border-[#00b14f] text-[#00b14f] hover:bg-green-50 shadow-sm"
                onClick={handleCheckStatus}
                disabled={isChecking}
             >
                {isChecking ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )}
                {isChecking ? "ĐANG KIỂM TRA..." : "KIỂM TRA TRẠNG THÁI"}
             </Button>
             
             <Button 
                variant="ghost" 
                className="w-full h-12 text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-xl transition-all"
                onClick={() => { logout(); navigate('/login'); }}
             >
                <LogOut size={18} className="mr-2" /> ĐĂNG XUẤT
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
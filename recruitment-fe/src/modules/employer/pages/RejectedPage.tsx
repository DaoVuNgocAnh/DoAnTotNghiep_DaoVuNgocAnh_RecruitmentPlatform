import { useState } from 'react';
import { XCircle, RefreshCw, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../api/company.api'; 
import { useQueryClient } from '@tanstack/react-query'; // Dùng React Query
import { toast } from 'sonner';

export const RejectedPage = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [isReseting, setIsReseting] = useState(false);
  const navigate = useNavigate();

  const handleRetry = async () => {
    setIsReseting(true);
    try {
      // 1. Gọi API Backend để xóa bản ghi bị REJECTED
      await companyApi.deleteMyCompany();

      /**
       * 2. Làm mới dữ liệu User.
       * Sau khi fetch lại, Backend sẽ trả về companyId: null.
       * EmployerGuard sẽ thấy điều này và tự động đưa bạn về trang Setup để đăng ký lại.
       */
      await queryClient.invalidateQueries({ queryKey: ['auth-user'] });

      toast.success("Hồ sơ đã được reset. Bạn có thể thực hiện đăng ký lại!");
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể reset hồ sơ lúc này");
    } finally {
      setIsReseting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
      <Card className="max-w-md w-full rounded-3xl shadow-2xl border-none p-8 text-center animate-in zoom-in duration-300">
        <CardHeader className="p-0 mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
            <XCircle size={40} className="text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">Hồ sơ bị từ chối</CardTitle>
          <CardDescription className="text-base pt-2 text-red-500 font-bold uppercase tracking-tight">
            Thông tin doanh nghiệp không hợp lệ
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-0">
          <div className="p-5 bg-red-50/30 rounded-2xl border border-red-100 text-sm text-slate-600 text-left space-y-3 font-medium">
            <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase tracking-wider">
               <AlertCircle size={14} /> Thông tin từ Admin:
            </div>
            <p className="leading-relaxed">
              Mã số thuế của bạn không khớp với dữ liệu quốc gia hoặc thông tin mô tả chưa đạt yêu cầu. Vui lòng thực hiện đăng ký lại.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
             <Button 
                onClick={handleRetry} 
                disabled={isReseting}
                className="w-full h-12 rounded-xl gap-2 font-black bg-[#00b14f] hover:bg-[#009643] shadow-lg shadow-green-200 transition-all active:scale-95"
             >
                {isReseting ? (
                    <Loader2 className="animate-spin" size={18} />
                ) : (
                    <RefreshCw size={18} />
                )}
                {isReseting ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ LẠI HỒ SƠ"}
             </Button>
             
             <Button 
                variant="ghost" 
                onClick={() => { logout(); navigate('/login'); }} 
                className="w-full h-12 text-slate-400 font-bold hover:bg-slate-100 rounded-xl"
             >
                <LogOut size={18} className="mr-2"/> ĐĂNG XUẤT
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
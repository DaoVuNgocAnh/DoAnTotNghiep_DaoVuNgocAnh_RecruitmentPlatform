import { Ban, ShieldAlert } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const BlacklistPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="max-w-md w-full rounded-3xl shadow-2xl border-none p-10 text-center bg-white">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
          <Ban size={48} className="text-red-600" />
        </div>
        <CardTitle className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Truy cập bị chặn</CardTitle>
        <p className="text-slate-500 mb-8 font-medium">
          Tài khoản doanh nghiệp của bạn đã bị đưa vào danh sách đen do vi phạm nghiêm trọng chính sách của SmartCV. Mọi quyền truy cập đã bị khóa vĩnh viễn.
        </p>
        
        <div className="p-4 bg-slate-100 rounded-xl mb-8 flex items-center gap-3 text-left">
          <ShieldAlert className="text-amber-600 shrink-0" size={24} />
          <p className="text-xs text-slate-600 font-bold">Nếu bạn cho rằng đây là một sai sót, vui lòng liên hệ bộ phận hỗ trợ pháp lý của chúng tôi.</p>
        </div>

        <Button 
          variant="destructive" 
          onClick={() => { logout(); navigate('/login'); }} 
          className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-red-200"
        >
          ĐĂNG XUẤT KHỎI HỆ THỐNG
        </Button>
      </Card>
    </div>
  );
};
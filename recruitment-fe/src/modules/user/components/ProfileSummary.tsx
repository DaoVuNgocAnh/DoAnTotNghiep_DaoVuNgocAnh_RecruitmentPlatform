import { Camera, CircleCheck, Loader2, Mail, Shield, Smartphone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileSummaryProps {
  user: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateAvatarMutation: any;
}

export const ProfileSummary = ({
  user,
  fileInputRef,
  handleAvatarChange,
  updateAvatarMutation,
}: ProfileSummaryProps) => {
  return (
    <div className="lg:col-span-4 space-y-6">
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <div className="h-32 bg-slate-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <CardContent className="px-8 pb-10 text-center relative">
          <div className="flex justify-center -mt-16 mb-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <AvatarImage src={user?.avatarUrl || ''} className="object-cover" />
                <AvatarFallback className="text-3xl bg-slate-50 text-primary font-black uppercase">
                  {user?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {updateAvatarMutation.isPending && (
                <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-transform z-20"
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{user?.fullName}</h1>
          <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full mb-8">
            {user?.role}
          </Badge>

          <div className="space-y-4 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                <Mail size={14} />
              </div>
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                <Smartphone size={14} />
              </div>
              <span>{user?.phone || "Chưa cập nhật SĐT"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Tài khoản xác thực</p>
          <h3 className="text-lg font-black uppercase leading-tight mb-6">Mức độ hoàn thiện <br /> hồ sơ: 85%</h3>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
            <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(0,177,79,0.5)]"></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 italic flex items-center gap-2">
            <CircleCheck size={12} className="text-primary" /> Bạn đã sẵn sàng ứng tuyển
          </p>
        </div>
      </div>
    </div>
  );
};

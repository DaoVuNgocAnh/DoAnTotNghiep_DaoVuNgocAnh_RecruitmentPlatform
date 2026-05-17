import { PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SetupChoiceProps {
  onSelectStep: (step: 'create' | 'join') => void;
}

export const SetupChoice = ({ onSelectStep }: SetupChoiceProps) => {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
        <Card
          className="group hover:border-[#00b14f] transition-all cursor-pointer shadow-xl border-2 border-transparent rounded-3xl overflow-hidden"
          onClick={() => onSelectStep('create')}
        >
          <CardHeader className="text-center pt-10">
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00b14f] transition-all duration-300 group-hover:rotate-6">
              <PlusCircle size={40} className="text-[#00b14f] group-hover:text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Tôi là chủ doanh nghiệp</CardTitle>
            <CardDescription className="px-6 font-medium">Đăng ký hồ sơ pháp nhân để đăng tin tuyển dụng.</CardDescription>
          </CardHeader>
          <CardContent className="pb-10 text-center">
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-[#00b14f] text-[#00b14f]">Yêu cầu Mã số thuế</Badge>
          </CardContent>
        </Card>

        <Card
          className="group hover:border-blue-500 transition-all cursor-pointer shadow-xl border-2 border-transparent rounded-3xl overflow-hidden"
          onClick={() => onSelectStep('join')}
        >
          <CardHeader className="text-center pt-10">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-all duration-300 group-hover:-rotate-6">
              <Search size={40} className="text-blue-500 group-hover:text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Tôi là nhân viên HR</CardTitle>
            <CardDescription className="px-6 font-medium">Gia nhập vào một công ty đã có sẵn trên hệ thống.</CardDescription>
          </CardHeader>
          <CardContent className="pb-10 text-center">
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-blue-500 text-blue-500">Cần sếp phê duyệt</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

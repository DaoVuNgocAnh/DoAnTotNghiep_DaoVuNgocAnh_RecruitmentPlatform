import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const CVQuickManual = () => {
  return (
    <Card className="rounded-[2rem] border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] bg-slate-900 text-white overflow-hidden animate-in fade-in duration-300 delay-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
          <Info size={14} /> Hướng dẫn nhanh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 text-[11px] text-slate-300 font-medium leading-relaxed">
        <p>📍 **Sửa trực tiếp:** Sửa tiêu đề hay nội dung bằng cách click trực tiếp vào chữ và gõ phím.</p>
        <p>➕ **Tạo mục lớn:** Di chuột vào tiêu đề của bất cứ mục lớn nào trên Bản xem trước CV, bấm nút `+` màu xanh lá để chèn thêm một mục lớn tự viết ngay phía dưới mục đó.</p>
        <p>🔠 **Định dạng:** Nhấn <code className="text-white bg-slate-800 px-1 py-0.5 rounded text-[10px]">Ctrl + B</code> (đậm), <code className="text-white bg-slate-800 px-1 py-0.5 rounded text-[10px]">Ctrl + I</code> (nghiêng).</p>
        <p>↕️ **Đổi thứ tự:** Di chuột vào tiêu đề các mục lớn trên Bản xem trước CV để đổi vị trí lên/xuống.</p>
      </CardContent>
    </Card>
  );
};
export default CVQuickManual;

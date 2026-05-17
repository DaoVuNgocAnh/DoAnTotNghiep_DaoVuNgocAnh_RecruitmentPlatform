import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CompanyFormValues } from '../hooks/useCompanyProfile';

interface CompanyAboutProps {
  company: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  form: UseFormReturn<CompanyFormValues>;
  onSubmit: (data: CompanyFormValues) => void;
}

export const CompanyAbout = ({
  company,
  isEditing,
  setIsEditing,
  form,
  onSubmit,
}: CompanyAboutProps) => {
  return (
    <div className="space-y-8">
      {isEditing ? (
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">Cập nhật thông tin chi tiết</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl font-black text-[10px] uppercase">Hủy</Button>
              <Button onClick={form.handleSubmit(onSubmit)} className="rounded-xl bg-[#00b14f] hover:bg-[#009643] font-black text-[10px] uppercase h-10 px-6">Lưu hồ sơ</Button>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên công ty</label>
                <Input {...form.register('name')} className="h-12 rounded-xl border-slate-100 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website</label>
                <Input {...form.register('websiteUrl')} className="h-12 rounded-xl border-slate-100 font-bold" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ trụ sở</label>
                <Input {...form.register('location')} placeholder="Ví dụ: Tòa nhà Keangnam, Mễ Trì, Nam Từ Liêm, Hà Nội" className="h-12 rounded-xl border-slate-100 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Giới thiệu doanh nghiệp</label>
              <Textarea {...form.register('description')} rows={12} className="rounded-2xl border-slate-100 font-medium leading-relaxed" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">Về chúng tôi</CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <p className="whitespace-pre-wrap text-slate-600 font-medium leading-8 text-base">
              {company.description || "Doanh nghiệp chưa cập nhật mô tả."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

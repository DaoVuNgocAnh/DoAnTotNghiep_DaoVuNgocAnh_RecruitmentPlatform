import type { UseFormReturn } from 'react-hook-form';
import { Building2, FileText, Globe, Hash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { CreateCompanyValues } from '../hooks/useEmployerSetup';

interface SetupCreateProps {
  form: UseFormReturn<CreateCompanyValues>;
  onSubmit: (values: CreateCompanyValues) => void;
  isPending: boolean;
}

export const SetupCreate = ({ form, onSubmit, isPending }: SetupCreateProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Tên công ty</FormLabel>
              <div className="relative group">
                <Building2 className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
                <FormControl><Input placeholder="Cty TNHH SmartCV" className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" {...field} /></FormControl>
              </div>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )} />

          <FormField control={form.control} name="taxCode" render={({ field }) => (
            <FormItem>
              <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Mã số thuế</FormLabel>
              <div className="relative group">
                <Hash className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
                <FormControl><Input placeholder="0101234567" className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" {...field} /></FormControl>
              </div>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="websiteUrl" render={({ field }) => (
          <FormItem>
            <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Website chính thức</FormLabel>
            <div className="relative group">
              <Globe className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
              <FormControl><Input placeholder="https://smartcv.vn" className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" {...field} /></FormControl>
            </div>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Mô tả doanh nghiệp</FormLabel>
            <div className="relative group">
              <FileText className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
              <FormControl><Textarea placeholder="Giới thiệu ngắn về lĩnh vực hoạt động..." className="pl-10 rounded-xl min-h-[120px] pt-3 focus-visible:ring-[#00b14f] border-slate-200 font-medium" {...field} /></FormControl>
            </div>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )} />

        <Separator className="my-6 opacity-50" />

        <Button
          type="submit"
          className="w-full h-14 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-2xl shadow-xl shadow-green-100 transition-all text-lg active:scale-[0.98]"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ĐANG XÁC THỰC...
            </>
          ) : (
            'HOÀN TẤT ĐĂNG KÝ DOANH NGHIỆP'
          )}
        </Button>
      </form>
    </Form>
  );
};

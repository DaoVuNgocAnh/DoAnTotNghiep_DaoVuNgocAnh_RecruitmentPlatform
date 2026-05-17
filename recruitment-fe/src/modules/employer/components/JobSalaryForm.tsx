import type { UseFormReturn } from "react-hook-form";
import { DollarSign, Info } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { JobFormValues } from "../hooks/useManageJob";

interface JobSalaryFormProps {
  form: UseFormReturn<JobFormValues>;
  isNegotiable: boolean;
}

export const JobSalaryForm = ({ form, isNegotiable }: JobSalaryFormProps) => {
  return (
    <div className="md:col-span-2 space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
          <DollarSign size={16} className="text-[#00b14f]" /> Cấu trúc lương (Dùng để ứng viên lọc)
        </h4>
        <FormField control={form.control} name="isSalaryNegotiable" render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="text-sm font-bold text-slate-600 cursor-pointer">Lương thỏa thuận</FormLabel>
          </FormItem>
        )} />
      </div>

      {!isNegotiable && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <FormField control={form.control} name="salaryMin" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lương tối thiểu (VNĐ)</FormLabel>
              <FormControl><Input type="number" placeholder="Ví dụ: 10000000" className="h-12 rounded-xl" {...field} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="salaryMax" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lương tối đa (VNĐ)</FormLabel>
              <FormControl><Input type="number" placeholder="Ví dụ: 20000000" className="h-12 rounded-xl" {...field} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      )}
      <p className="text-[11px] text-slate-400 italic flex items-center gap-1">
        <Info size={12} /> Cung cấp mức lương chính xác giúp tăng 40% tỉ lệ ứng tuyển.
      </p>
    </div>
  );
};

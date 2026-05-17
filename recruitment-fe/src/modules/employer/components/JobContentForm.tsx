import type { UseFormReturn } from "react-hook-form";
import { FileText, ListChecks } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { JobFormValues } from "../hooks/useManageJob";

interface JobContentFormProps {
  form: UseFormReturn<JobFormValues>;
}

export const JobContentForm = ({ form }: JobContentFormProps) => {
  return (
    <div className="space-y-8">
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <FileText size={14} className="text-[#00b14f]" /> Mô tả chi tiết công việc
          </FormLabel>
          <FormControl><Textarea className="min-h-[150px] rounded-2xl pt-4 focus-visible:ring-[#00b14f]" placeholder="Nhiệm vụ chính hàng ngày, công nghệ sử dụng..." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="requirement" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <ListChecks size={14} className="text-[#00b14f]" /> Yêu cầu chuyên môn & kỹ năng
          </FormLabel>
          <FormControl><Textarea className="min-h-[150px] rounded-2xl pt-4 focus-visible:ring-[#00b14f]" placeholder="Kỹ năng cần thiết, số năm kinh nghiệm, học vấn..." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
};

import type { UseFormReturn } from "react-hook-form";
import { Briefcase, CalendarDays, Clock, MapPin, PlusCircle } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATIONS, JOB_TYPES } from "@/constants/job.constants";
import type { JobFormValues } from "../hooks/useManageJob";

interface JobBasicInfoFormProps {
  form: UseFormReturn<JobFormValues>;
  categories: any[] | undefined;
}

export const JobBasicInfoForm = ({ form, categories }: JobBasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Tiêu đề */}
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <Briefcase size={14} className="text-[#00b14f]" /> Tiêu đề công việc
          </FormLabel>
          <FormControl><Input placeholder="Ví dụ: Senior ReactJS Developer" className="h-12 rounded-xl focus-visible:ring-[#00b14f]" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      {/* Ngành nghề */}
      <FormField control={form.control} name="categoryId" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest">Danh mục ngành nghề</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger className="h-12 rounded-xl focus:ring-[#00b14f]"><SelectValue placeholder="Chọn ngành nghề" /></SelectTrigger></FormControl>
            <SelectContent className="rounded-xl">
              {categories?.map((c: any) => (
                <SelectItem key={c.id} value={c.id} className="font-medium py-3 cursor-pointer">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />

      {/* Loại hình */}
      <FormField control={form.control} name="jobType" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
             <Clock size={14} className="text-[#00b14f]" /> Loại hình công việc
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger className="h-12 rounded-xl focus:ring-[#00b14f]"><SelectValue placeholder="Chọn loại hình" /></SelectTrigger></FormControl>
            <SelectContent className="rounded-xl">
              {JOB_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value} className="font-medium py-3 cursor-pointer">{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />

      {/* Địa điểm */}
      <FormField control={form.control} name="location" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <MapPin size={14} className="text-[#00b14f]" /> Địa điểm làm việc
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger className="h-12 rounded-xl focus:ring-[#00b14f]"><SelectValue placeholder="Chọn địa điểm" /></SelectTrigger></FormControl>
            <SelectContent className="rounded-xl">
              {LOCATIONS.filter(l => l !== "Tất cả địa điểm").map((loc) => (
                <SelectItem key={loc} value={loc} className="font-medium py-3 cursor-pointer">{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />

      {/* Hạn nộp */}
      <FormField control={form.control} name="expiredDate" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <CalendarDays size={14} className="text-[#00b14f]" /> Hạn nộp hồ sơ
          </FormLabel>
          <FormControl>
            <Input type="date" className="h-12 rounded-xl focus-visible:ring-[#00b14f]" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      {/* Kinh nghiệm */}
      <FormField control={form.control} name="requiredExperience" render={({ field }) => (
        <FormItem>
          <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
             <PlusCircle size={14} className="text-[#00b14f]" /> Kinh nghiệm yêu cầu
          </FormLabel>
          <FormControl><Input placeholder="Ví dụ: 1 - 2 năm, Không yêu cầu..." className="h-12 rounded-xl focus-visible:ring-[#00b14f]" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
};

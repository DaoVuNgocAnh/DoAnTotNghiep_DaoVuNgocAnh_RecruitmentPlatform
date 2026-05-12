import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useJobCategories, useCreateJob } from "../../job/api/job.api";
import type { JobCategory } from "../../job/api/job.api";
import { toast } from "sonner";
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  FileText, 
  ListChecks, 
  PlusCircle, 
  Loader2,
  CalendarDays,
  Clock,
  Info
} from "lucide-react";
import { LOCATIONS, JOB_TYPES } from "@/constants/job.constants";

// UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const jobSchema = z.object({
  title: z.string().min(5, "Tiêu đề quá ngắn"),
  categoryId: z.string().min(1, "Vui lòng chọn ngành nghề"),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "REMOTE"]),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  isSalaryNegotiable: z.boolean(),
  location: z.string().min(1, "Địa điểm không được để trống"),
  description: z.string().min(20, "Mô tả công việc cần chi tiết hơn"),
  requirement: z.string().min(20, "Yêu cầu công việc cần chi tiết hơn"),
  expiredDate: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
});

type JobFormValues = z.infer<typeof jobSchema>;

export const ManageJobsPage = () => {
  const { data: categories } = useJobCategories();
  const { mutate: createJob, isPending } = useCreateJob();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: { 
      title: "", 
      categoryId: "", 
      jobType: "FULL_TIME", 
      salaryMin: undefined,
      salaryMax: undefined,
      isSalaryNegotiable: false,
      location: "", 
      description: "", 
      requirement: "",
      expiredDate: "" 
    },
  });

  const isNegotiable = form.watch("isSalaryNegotiable");

  const onSubmit = (values: JobFormValues) => {
    createJob(values, {
      onSuccess: () => {
        toast.success("Tin tuyển dụng đã được gửi và đang chờ Admin hệ thống phê duyệt!");
        form.reset();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Đăng tin thất bại");
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="bg-[#001529] text-white p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00b14f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
              <PlusCircle size={28} />
            </div>
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-white italic">Tạo tin tuyển dụng</CardTitle>
              <CardDescription className="text-slate-400 font-medium italic">Thông tin chính xác giúp bạn tiếp cận đúng ứng viên tiềm năng.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        {categories?.map((c: JobCategory) => (
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

                

                {/* Cấu trúc lương để lọc */}
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
              </div>

              {/* ... description and requirement textarea fields ... */}
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

              <Button type="submit" disabled={isPending} className="w-full h-14 bg-[#00b14f] hover:bg-[#009643] text-white font-black text-lg rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-95 uppercase tracking-wider">
                {isPending ? <><Loader2 className="animate-spin mr-2" /> ĐANG XỬ LÝ HỒ SƠ TIN ĐĂNG...</> : "GỬI TIN & CHỜ PHÊ DUYỆT"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
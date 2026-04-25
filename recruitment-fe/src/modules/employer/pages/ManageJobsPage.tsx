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
  CalendarDays
} from "lucide-react";

// UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const jobSchema = z.object({
  title: z.string().min(5, "Tiêu đề quá ngắn"),
  categoryId: z.string().min(1, "Vui lòng chọn ngành nghề"),
  salary: z.string().min(1, "Mức lương không được để trống"),
  location: z.string().min(1, "Địa điểm không được để trống"),
  description: z.string().min(20, "Mô tả công việc cần chi tiết hơn"),
  requirement: z.string().min(20, "Yêu cầu công việc cần chi tiết hơn"),
  // TRƯỜNG MỚI: Hạn nộp hồ sơ
  expiredDate: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
});

type JobFormValues = z.infer<typeof jobSchema>;

export const ManageJobsPage = () => {
  const { data: categories } = useJobCategories();
  const { mutate: createJob, isPending } = useCreateJob();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: { 
      title: "", 
      categoryId: "", 
      salary: "", 
      location: "", 
      description: "", 
      requirement: "",
      expiredDate: "" 
    },
  });

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

                {/* Lương */}
                <FormField control={form.control} name="salary" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
                      <DollarSign size={14} className="text-[#00b14f]" /> Mức lương
                    </FormLabel>
                    <FormControl><Input placeholder="15 - 25 triệu / Thỏa thuận" className="h-12 rounded-xl focus-visible:ring-[#00b14f]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Địa điểm */}
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
                      <MapPin size={14} className="text-[#00b14f]" /> Địa điểm làm việc
                    </FormLabel>
                    <FormControl><Input placeholder="Quận 1, TP.HCM / Toàn quốc" className="h-12 rounded-xl focus-visible:ring-[#00b14f]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* TRƯỜNG MỚI: HẠN NỘP HỒ SƠ */}
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
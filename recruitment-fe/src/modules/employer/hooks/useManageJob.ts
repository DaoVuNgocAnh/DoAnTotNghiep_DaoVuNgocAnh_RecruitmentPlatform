import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useJobCategories, useCreateJob } from "../../job/api/job.api";
import { toast } from "sonner";

export const jobSchema = z.object({
  title: z.string().min(5, "Tiêu đề quá ngắn"),
  categoryId: z.string().min(1, "Vui lòng chọn ngành nghề"),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "REMOTE"]),
  requiredExperience: z.string().min(1, "Vui lòng nhập yêu cầu kinh nghiệm"),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  isSalaryNegotiable: z.boolean(),
  location: z.string().min(1, "Địa điểm không được để trống"),
  description: z.string().min(20, "Mô tả công việc cần chi tiết hơn"),
  requirement: z.string().min(20, "Yêu cầu công việc cần chi tiết hơn"),
  expiredDate: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
});

export type JobFormValues = z.infer<typeof jobSchema>;

export const useManageJob = () => {
  const { data: categories } = useJobCategories();
  const { mutate: createJob, isPending } = useCreateJob();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: { 
      title: "", 
      categoryId: "", 
      jobType: "FULL_TIME", 
      requiredExperience: "",
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

  return {
    categories,
    isPending,
    form,
    isNegotiable,
    onSubmit,
  };
};

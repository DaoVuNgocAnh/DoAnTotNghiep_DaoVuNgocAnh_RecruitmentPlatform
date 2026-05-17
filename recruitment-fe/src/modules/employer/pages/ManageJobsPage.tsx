import { Loader2, PlusCircle } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useManageJob } from "../hooks/useManageJob";
import { JobBasicInfoForm } from "../components/JobBasicInfoForm";
import { JobSalaryForm } from "../components/JobSalaryForm";
import { JobContentForm } from "../components/JobContentForm";

export const ManageJobsPage = () => {
  const { categories, isPending, form, isNegotiable, onSubmit } = useManageJob();

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
              <JobBasicInfoForm form={form} categories={categories} />
              
              <JobSalaryForm form={form} isNegotiable={isNegotiable} />

              <JobContentForm form={form} />

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

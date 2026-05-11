import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Phone, Mail, MessageSquare } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { companyApi } from "../api/company.api";

const formSchema = z.object({
  contactPhone: z.string().min(10, "Số điện thoại không hợp lệ"),
  contactEmail: z.string().email("Email không hợp lệ"),
  note: z.string().optional(),
});

interface PremiumUpgradeModalProps {
  children: React.ReactNode;
  defaultEmail?: string;
  defaultPhone?: string;
}

export const PremiumUpgradeModal = ({ children, defaultEmail, defaultPhone }: PremiumUpgradeModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactPhone: defaultPhone || "",
      contactEmail: defaultEmail || "",
      note: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await companyApi.createPremiumRequest(values);
      toast.success("Gửi yêu cầu thành công! Admin sẽ liên hệ với bạn sớm nhất.");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] overflow-hidden border-none shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
        
        <DialogHeader className="pt-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm ring-1 ring-amber-100">
            <ShieldCheck size={32} className="text-amber-600 fill-amber-600/10" />
          </div>
          <DialogTitle className="text-2xl font-black text-center text-slate-900 uppercase tracking-tight">
            Nâng cấp Đối tác Uy tín
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 font-medium px-4">
            Khẳng định thương hiệu doanh nghiệp và ưu tiên hiển thị mọi tin tuyển dụng trên hệ thống.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700 flex items-center gap-2">
                    <Phone size={14} className="text-amber-500" /> Số điện thoại liên hệ
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại của bạn" className="rounded-xl border-slate-200 h-11 focus:ring-amber-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700 flex items-center gap-2">
                    <Mail size={14} className="text-amber-500" /> Email nhận tư vấn
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email của bạn" className="rounded-xl border-slate-200 h-11 focus:ring-amber-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700 flex items-center gap-2">
                    <MessageSquare size={14} className="text-amber-500" /> Ghi chú thêm
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="VD: Tôi muốn mua gói 12 tháng..." 
                      className="rounded-xl border-slate-200 min-h-[100px] focus:ring-amber-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-slate-200 gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Gửi yêu cầu nâng cấp</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

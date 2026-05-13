// src/modules/home/components/Newsletter.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { newsletterApi } from "../api/newsletter.api";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Địa chỉ email không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await newsletterApi.subscribe(email);
      setEmail("");
      toast.success("Đăng ký thành công! Bạn sẽ nhận được bản tin hàng tuần từ SmartCV.");
    } catch (error: any) {
      const message = error.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-[#001529] rounded-[4rem] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          {/* Trang trí */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00b14f]/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -ml-48 -mb-48" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                 Stay Connected
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                Đừng bỏ lỡ <span className="text-primary underline decoration-white/10 underline-offset-8">Cơ hội</span> mới nhất!
              </h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">Đăng ký bản tin của chúng tôi để nhận thông báo về những công việc phù hợp với kỹ năng của bạn ngay hôm nay.</p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full max-w-lg bg-white/5 p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-3">
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Địa chỉ email của bạn..." 
                  className="h-16 bg-transparent border-none focus-visible:ring-0 text-white font-bold placeholder:text-slate-500 text-lg px-6"
                />
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-[1.8rem] flex items-center gap-3 group shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      ĐĂNG KÝ <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
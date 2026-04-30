// src/modules/home/components/Newsletter.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const Newsletter = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-[#001529] rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Trang trí */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b14f]/20 blur-[80px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -ml-32 -mb-32" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                Đừng bỏ lỡ <span className="text-[#00b14f]">Cơ hội</span> mới nhất!
              </h2>
              <p className="text-slate-400 text-lg font-medium">Đăng ký nhận thông báo về những công việc phù hợp với kỹ năng của bạn ngay hôm nay.</p>
            </div>

            <div className="w-full max-w-md bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-2">
                <Input 
                  placeholder="Địa chỉ email của bạn..." 
                  className="h-14 bg-transparent border-none focus-visible:ring-0 text-white font-bold placeholder:text-slate-500 text-lg"
                />
                <Button className="h-14 px-8 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-2xl flex items-center gap-2 group shadow-lg shadow-green-900/20">
                  ĐĂNG KÝ <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
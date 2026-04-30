// src/modules/home/components/CategorySection.tsx
import { useJobCategories } from "../../job/api/job.api";
import { 
  Code2, 
  Palette, 
  BarChart3, 
  Megaphone, 
  Laptop, 
  Headphones, 
  ShieldCheck, 
  Smartphone 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, any> = {
  "Công nghệ thông tin": Code2,
  "Thiết kế": Palette,
  "Marketing": Megaphone,
  "Kế toán / Tài chính": BarChart3,
  "Kỹ thuật": Laptop,
  "Chăm sóc khách hàng": Headphones,
  "Bảo mật": ShieldCheck,
  "Mobile App": Smartphone,
};

export const CategorySection = () => {
  const { data: categories, isLoading } = useJobCategories();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight mb-4">
            Khám phá theo <span className="text-[#00b14f]">Ngành nghề</span>
          </h2>
          <p className="text-slate-500 font-medium">Tìm kiếm công việc theo lĩnh vực chuyên môn của bạn để có kết quả chính xác nhất.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))
          ) : (
            categories?.slice(0, 8).map((cat) => {
              const Icon = iconMap[cat.name] || Code2;
              return (
                <div key={cat.id} className="group p-8 rounded-3xl border border-slate-100 hover:border-[#00b14f]/30 hover:shadow-2xl hover:shadow-green-500/10 transition-all cursor-pointer bg-slate-50/30 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00b14f] group-hover:text-white transition-colors">
                    <Icon size={32} />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight group-hover:text-[#00b14f] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest italic">
                    {Math.floor(Math.random() * 500) + 100} việc làm
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
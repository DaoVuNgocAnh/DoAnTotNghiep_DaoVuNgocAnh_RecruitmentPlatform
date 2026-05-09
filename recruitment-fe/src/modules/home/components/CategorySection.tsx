import { 
  Monitor, 
  Megaphone, 
  PenTool, 
  Smartphone, 
  BarChart3, 
  Headphones,
  Globe,
  Database,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Công nghệ thông tin", icon: <Monitor size={24} />, count: "1,250", color: "text-blue-600 bg-blue-50" },
  { name: "Marketing / Quảng cáo", icon: <Megaphone size={24} />, count: "850", color: "text-rose-600 bg-rose-50" },
  { name: "Thiết kế đồ họa", icon: <PenTool size={24} />, count: "420", color: "text-violet-600 bg-violet-50" },
  { name: "Phát triển Mobile", icon: <Smartphone size={24} />, count: "310", color: "text-emerald-600 bg-emerald-50" },
  { name: "Phân tích dữ liệu", icon: <BarChart3 size={24} />, count: "180", color: "text-amber-600 bg-amber-50" },
  { name: "Chăm sóc khách hàng", icon: <Headphones size={24} />, count: "640", color: "text-cyan-600 bg-cyan-50" },
  { name: "Kinh doanh quốc tế", icon: <Globe size={24} />, count: "290", color: "text-indigo-600 bg-indigo-50" },
  { name: "Quản trị hệ thống", icon: <Database size={24} />, count: "150", color: "text-slate-600 bg-slate-50" },
];

export const CategorySection = () => {
  return (
    <section className="py-24 bg-[#f4f7f6]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Khám phá <span className="text-primary">Ngành nghề</span></h2>
           <p className="text-slate-500 font-medium italic text-sm">Tìm kiếm cơ hội nghề nghiệp theo lĩnh vực chuyên môn của bạn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              to="/jobs" 
              className="bg-white p-8 rounded-3xl border border-transparent hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group active:scale-[0.98]"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{cat.name}</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.count} Việc làm</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

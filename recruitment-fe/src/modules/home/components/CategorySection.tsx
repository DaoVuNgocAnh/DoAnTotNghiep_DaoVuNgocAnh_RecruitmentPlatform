import { 
  Monitor, 
  Megaphone, 
  PenTool, 
  Smartphone, 
  BarChart3, 
  Headphones,
  Globe,
  Database,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import { useJobCategories } from "../../job/api/job.api";

const getCategoryStyles = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("công nghệ") || lowerName.includes("it") || lowerName.includes("phần mềm")) {
    return { icon: <Monitor size={24} />, color: "text-blue-600 bg-blue-50" };
  }
  if (lowerName.includes("marketing") || lowerName.includes("quảng cáo") || lowerName.includes("truyền thông")) {
    return { icon: <Megaphone size={24} />, color: "text-rose-600 bg-rose-50" };
  }
  if (lowerName.includes("thiết kế") || lowerName.includes("design") || lowerName.includes("đồ họa")) {
    return { icon: <PenTool size={24} />, color: "text-violet-600 bg-violet-50" };
  }
  if (lowerName.includes("mobile") || lowerName.includes("điện thoại")) {
    return { icon: <Smartphone size={24} />, color: "text-emerald-600 bg-emerald-50" };
  }
  if (lowerName.includes("dữ liệu") || lowerName.includes("data") || lowerName.includes("phân tích")) {
    return { icon: <BarChart3 size={24} />, color: "text-amber-600 bg-amber-50" };
  }
  if (lowerName.includes("khách hàng") || lowerName.includes("customer") || lowerName.includes("tư vấn")) {
    return { icon: <Headphones size={24} />, color: "text-cyan-600 bg-cyan-50" };
  }
  if (lowerName.includes("kinh doanh") || lowerName.includes("sales") || lowerName.includes("thương mại")) {
    return { icon: <Globe size={24} />, color: "text-indigo-600 bg-indigo-50" };
  }
  if (lowerName.includes("quản trị") || lowerName.includes("hệ thống") || lowerName.includes("admin")) {
    return { icon: <Database size={24} />, color: "text-slate-600 bg-slate-50" };
  }

  return { icon: <Briefcase size={24} />, color: "text-primary bg-primary/5" };
};

export const CategorySection = () => {
  const { data: categories, isLoading } = useJobCategories();

  if (isLoading) return (
    <div className="py-24 bg-white flex flex-col items-center justify-center gap-4">
       <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
       <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Đang tải ngành nghề...</p>
    </div>
  );

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
           <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6">
                Khám phá <br />
                <span className="text-primary underline decoration-slate-100 underline-offset-8">Ngành nghề</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Đừng giới hạn bản thân. SmartCV giúp bạn tìm kiếm những cơ hội nghề nghiệp phù hợp nhất với kỹ năng chuyên môn của mình.
              </p>
           </div>
           <Link to="/jobs" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors pb-2">
              Xem tất cả ngành nghề <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories?.slice(0, 8).map((cat) => {
            const { icon, color } = getCategoryStyles(cat.name);
            const jobCount = cat._count?.jobs || 0;

            return (
              <Link 
                key={cat.id} 
                to={`/jobs?categoryId=${cat.id}`} 
                className="bg-slate-50/50 p-10 rounded-[3rem] border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all group active:scale-[0.98] relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`w-16 h-16 rounded-[1.5rem] ${color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  {icon}
                </div>
                
                <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1 leading-tight tracking-tight">
                  {cat.name}
                </h4>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Cơ hội</span>
                    <span className="text-sm font-bold text-slate-700">{jobCount.toLocaleString()} Việc làm</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-45 transition-all shadow-sm">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

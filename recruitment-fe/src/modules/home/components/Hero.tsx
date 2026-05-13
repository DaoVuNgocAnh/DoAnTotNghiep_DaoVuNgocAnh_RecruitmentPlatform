import { Search, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  search: string;
  setSearch: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  onSearch: () => void;
}

export const Hero = ({ search, setSearch, location, setLocation, onSearch }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-40 overflow-hidden bg-slate-950">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1521737706045-5396162d93e8?q=80&w=2070&auto=format&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover opacity-30 scale-105 animate-pulse duration-[15s]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary text-xs font-black uppercase tracking-[0.3em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl">
            <TrendingUp size={16} /> Nền tảng tuyển dụng thế hệ mới
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 select-none">
            NÂNG TẦM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] animate-gradient-x">SỰ NGHIỆP</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-tight tracking-tight">
            Smart<span className="text-primary font-black">CV</span> mang đến giải pháp kết nối tài năng đột phá bằng <span className="text-white font-bold border-b-2 border-primary/40 pb-1">AI Matching</span> và <span className="text-white font-bold border-b-2 border-primary/40 pb-1">Hồ sơ thông minh</span>.
          </p>

          {/* Search Box Container */}
          <div className="relative max-w-5xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-white p-3 md:p-4 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row gap-2 items-stretch animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="flex-[1.5] flex items-center px-6 gap-4 border-b md:border-b-0 md:border-r border-slate-100 py-4 md:py-0 group/input">
                <Search className="text-primary shrink-0 transition-transform group-focus-within/input:scale-110" size={24} />
                <input
                  type="text"
                  placeholder="Tên công việc, vị trí hoặc kỹ năng ứng tuyển..."
                  className="w-full outline-none text-base md:text-lg font-bold text-slate-700 placeholder:text-slate-400 bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
              </div>
              
              <div className="flex-1 flex items-center px-6 gap-4 py-4 md:py-0">
                <MapPin className="text-primary shrink-0" size={24} />
                <select 
                  className="w-full bg-transparent outline-none text-base md:text-lg font-bold text-slate-700 appearance-none cursor-pointer"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="Tất cả địa điểm">Tất cả địa điểm</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                </select>
              </div>
              
              <Button 
                onClick={onSearch}
                className="bg-primary hover:bg-primary/90 text-white font-black text-lg px-12 py-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
              >
                TÌM VIỆC NGAY
              </Button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-sm font-bold">
            <span className="text-white/40 uppercase tracking-widest text-[10px]">Xu hướng tìm kiếm:</span>
            {['ReactJS', 'Node.js', 'UI/UX Designer', 'Product Manager', 'Marketing AI'].map((tag) => (
              <button key={tag} className="hover:text-primary transition-colors flex items-center gap-1 group">
                <span className="text-primary/20 group-hover:text-primary transition-colors">#</span>{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-20"></div>
    </section>
  );
};

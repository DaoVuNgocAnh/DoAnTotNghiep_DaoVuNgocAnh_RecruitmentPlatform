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
    <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1521737706045-5396162d93e8?q=80&w=2070&auto=format&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover opacity-20 scale-105 animate-pulse duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <TrendingUp size={14} /> Nền tảng tuyển dụng thế hệ mới
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Tìm kiếm công việc <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">mơ ước</span> của bạn
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Hàng ngàn cơ hội việc làm hấp dẫn từ các công ty hàng đầu đang chờ đón bạn. Bắt đầu sự nghiệp ngay hôm nay.
          </p>

          {/* Search Box */}
          <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-2 items-stretch animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-slate-100 py-3 md:py-0">
              <Search className="text-primary shrink-0" size={20} />
              <input
                type="text"
                placeholder="Tên công việc, vị trí ứng tuyển..."
                className="w-full outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 py-3 md:py-0 sm:flex">
              <MapPin className="text-primary shrink-0" size={20} />
              <select 
                className="w-full bg-transparent outline-none text-sm font-bold text-slate-700 appearance-none cursor-pointer"
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
              className="bg-primary hover:bg-primary/90 text-white font-black text-base px-10 py-7 rounded-xl md:rounded-[2rem] shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              TÌM KIẾM NGAY
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-slate-500 text-sm font-bold">
            <span className="text-white/60">Từ khóa phổ biến:</span>
            {['ReactJS', 'Node.js', 'Designer', 'Marketing', 'Sales'].map((tag) => (
              <button key={tag} className="hover:text-primary transition-colors">#{tag}</button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Wave Decor */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f4f7f6] to-transparent"></div>
    </section>
  );
};

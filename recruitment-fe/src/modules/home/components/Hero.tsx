// src/modules/home/components/Hero.tsx
import { Search, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroProps {
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
}

export const Hero = ({ search, setSearch, onSearch }: HeroProps) => {
  const hotTags = ["ReactJS", "NodeJS", "Designer", "Marketing", "Remote"];

  return (
    <div className="relative overflow-hidden bg-[#001529] pt-24 pb-32 px-4">
      {/* Các thành phần trang trí nền */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#00b14f]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm">
          <TrendingUp size={16} className="text-[#00b14f]" />
          <span>Hơn 5,000+ cơ hội việc làm mới đang chờ bạn</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
          Sự nghiệp mơ ước <br />
          Khởi đầu từ <span className="text-[#00b14f] relative">
            SmartCV
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 5.5C50 2 150 2 200 5.5" stroke="#00b14f" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
          Nền tảng kết nối ứng viên tài năng với các doanh nghiệp hàng đầu. Tìm kiếm, ứng tuyển và phát triển sự nghiệp của bạn ngay hôm nay.
        </p>

        {/* Thanh tìm kiếm nâng cao */}
        <div className="max-w-5xl mx-auto bg-white p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row gap-2 border-4 border-white/10 ring-1 ring-white/5">
          <div className="flex-[2] relative group">
            <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={24} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tên công việc, vị trí, kỹ năng..." 
              className="h-14 pl-14 pr-4 border-none focus-visible:ring-0 text-slate-700 font-bold text-lg bg-transparent"
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>
          
          <div className="flex-1 border-l border-slate-100 flex items-center px-2 group">
            <MapPin className="text-slate-400 ml-2 group-focus-within:text-[#00b14f] transition-colors" size={20} />
            <Select>
              <SelectTrigger className="border-none focus:ring-0 shadow-none h-14 font-bold text-slate-700 text-lg">
                <SelectValue placeholder="Toàn quốc" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl font-medium">
                <SelectItem value="all">Toàn quốc</SelectItem>
                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="hn">Hà Nội</SelectItem>
                <SelectItem value="dn">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={onSearch}
            className="h-14 px-10 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-2xl text-lg shadow-lg shadow-green-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            TÌM KIẾM
          </Button>
        </div>

        {/* Hot Tags */}
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Từ khóa phổ biến:</span>
          {hotTags.map((tag) => (
            <button 
              key={tag}
              onClick={() => { setSearch(tag); onSearch(); }}
              className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-bold hover:bg-[#00b14f] hover:text-white hover:border-[#00b14f] transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
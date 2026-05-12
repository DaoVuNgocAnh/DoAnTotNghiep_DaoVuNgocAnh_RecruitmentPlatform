import { useTrendingJobs } from "../../job/api/job.api";
import { JobCard } from "@/components/shared/JobCard";
import { ChevronRight, Flame, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "../components/Hero";
import { StatsSection } from "../components/StatsSection";
import { CategorySection } from "../components/CategorySection";
import { FeaturedCompanies } from "../components/FeaturedCompanies";
import { Newsletter } from "../components/Newsletter";
import { Button } from "@/components/ui/button";

export const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Tất cả địa điểm");

  const { data: trendingJobs } = useTrendingJobs();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location !== "Tất cả địa điểm") params.set("location", location);
    
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-[#f4f7f6] min-h-screen">
      {/* Hero Section */}
      <Hero 
        search={search} 
        setSearch={setSearch} 
        location={location}
        setLocation={setLocation}
        onSearch={handleSearch} 
      />

      {/* Stats Section */}
      <StatsSection />

      {/* Trending Jobs Section (Scoring Algorithm) */}
      {trendingJobs && trendingJobs.length > 0 && (
        <div className="bg-slate-950 py-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
              <Flame size={300} className="text-primary animate-pulse" />
           </div>
           <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                       <Flame size={28} className="text-white" />
                    </div>
                    Việc làm <span className="text-primary italic">Xu hướng</span>
                  </h2>
                  <p className="text-slate-400 font-medium mt-4 ml-2 italic">Những cơ hội nghề nghiệp đang thu hút sự quan tâm lớn nhất</p>
                </div>
                <div className="hidden md:flex gap-4">
                   <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">
                      Cập nhật tự động
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingJobs.slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} isTrending={true} />
                ))}
              </div>

              <div className="mt-16 text-center">
                 <Button 
                   onClick={() => navigate('/jobs?sortBy=viewCount')}
                   variant="outline" 
                   className="rounded-full border-primary text-primary hover:bg-primary hover:text-white font-black uppercase tracking-widest px-12 h-14"
                 >
                    Xem tất cả việc làm xu hướng
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Companies */}
      <FeaturedCompanies />

      {/* Latest Jobs Redirect Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-6">
                Bạn đang tìm kiếm <br />
                <span className="text-primary italic">Cơ hội mới?</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium mb-10">
                Hệ thống của chúng tôi cập nhật hàng trăm tin tuyển dụng mới mỗi ngày từ các doanh nghiệp hàng đầu Việt Nam. Đừng bỏ lỡ cơ hội bứt phá sự nghiệp.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate('/jobs')}
                  className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-10 h-14 shadow-lg shadow-primary/20"
                >
                  Khám phá ngay <ChevronRight size={18} className="ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/jobs?sortBy=createdAt')}
                  className="rounded-full border-slate-200 text-slate-600 font-black uppercase tracking-widest px-10 h-14"
                >
                  Việc làm mới nhất
                </Button>
              </div>
           </div>
           <div className="relative z-10 flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-50 rounded-[3rem] flex items-center justify-center -rotate-6 border border-slate-100 shadow-inner">
                 <Sparkles size={80} className="text-primary/20" />
              </div>
           </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};


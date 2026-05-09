import { useAllJobs } from "../../job/api/job.api";
import type { Job } from "../../job/api/job.api";
import { JobCard } from "@/components/shared/JobCard";
import { Loader2, Info, ChevronRight, Flame, Sparkles } from "lucide-react";
import { useState } from "react";
import { Hero } from "../components/Hero";
import { StatsSection } from "../components/StatsSection";
import { CategorySection } from "../components/CategorySection";
import { FeaturedCompanies } from "../components/FeaturedCompanies";
import { Newsletter } from "../components/Newsletter";
import { Button } from "@/components/ui/button";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: jobs, isLoading } = useAllJobs({ search: searchQuery });

  const handleSearch = () => {
    setSearchQuery(search);
  };

  const hotJobs = jobs?.filter(job => job.isFeatured) || [];
  const regularJobs = jobs?.filter(job => !job.isFeatured) || [];

  return (
    <div className="bg-[#f4f7f6] min-h-screen">
      {/* Hero Section */}
      <Hero search={search} setSearch={setSearch} onSearch={handleSearch} />

      {/* Stats Section */}
      <StatsSection />

      {/* Hot Jobs Section (Only show if there are hot jobs and no active search) */}
      {hotJobs.length > 0 && !searchQuery && (
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
                    Việc làm <span className="text-primary italic">Tiêu điểm</span>
                  </h2>
                  <p className="text-slate-400 font-medium mt-4 ml-2 italic">Những cơ hội nghề nghiệp hấp dẫn nhất đang chờ đón bạn</p>
                </div>
                <div className="hidden md:flex gap-4">
                   <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">
                      Đã kiểm duyệt 100%
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotJobs.slice(0, 6).map((job: Job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
           </div>
        </div>
      )}

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Companies */}
      <FeaturedCompanies />

      {/* Latest Jobs Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-primary -rotate-3">
                  <Sparkles size={24} />
               </div>
              Việc làm <span className="text-primary">Mới nhất</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 ml-2 italic">Khám phá các cơ hội vừa mới đăng tải trên hệ thống</p>
          </div>
          <Button variant="outline" className="rounded-full border-primary/20 text-primary font-black uppercase tracking-widest px-10 h-12 hover:bg-primary hover:text-white transition-all group shadow-sm">
            Xem tất cả <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={64} />
            <p className="font-bold text-slate-400 animate-pulse uppercase tracking-[0.3em] text-xs">Sàng lọc cơ hội tốt nhất...</p>
          </div>
        ) : regularJobs.length === 0 && hotJobs.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Info className="text-slate-200" size={48} />
             </div>
             <p className="text-slate-500 font-black uppercase tracking-widest text-lg">Hệ thống chưa tìm thấy công việc phù hợp.</p>
             <p className="text-slate-400 font-medium mt-2 italic px-4">Hãy thử tìm kiếm với các từ khóa khác hoặc quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(searchQuery ? jobs : regularJobs)?.slice(0, 12).map((job: Job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

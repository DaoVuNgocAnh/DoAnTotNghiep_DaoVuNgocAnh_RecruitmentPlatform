// src/modules/home/pages/HomePage.tsx
import { useAllJobs } from "../../job/api/job.api";
import type { Job } from "../../job/api/job.api";
import { JobCard } from "@/components/shared/JobCard";
import { Loader2, Info, ChevronRight } from "lucide-react";
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

  return (
    <div className="bg-[#f4f7f6] min-h-screen">
      {/* Hero Section */}
      <Hero search={search} setSearch={setSearch} onSearch={handleSearch} />

      {/* Stats Section */}
      <StatsSection />

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Companies */}
      <FeaturedCompanies />

      {/* Latest Jobs Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight border-l-8 border-[#00b14f] pl-6">
              Việc làm <span className="text-[#00b14f]">Mới nhất</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2 ml-8 italic">Đừng bỏ lỡ những cơ hội vừa được cập nhật</p>
          </div>
          <Button variant="outline" className="rounded-full border-[#00b14f] text-[#00b14f] font-black uppercase tracking-widest px-8 hover:bg-[#00b14f] hover:text-white transition-all group">
            Xem tất cả việc làm <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#00b14f]" size={64} />
            <p className="font-bold text-slate-400 animate-pulse uppercase tracking-[0.3em] text-sm">Đang phân tích cơ hội dành cho bạn...</p>
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
             <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="text-slate-300" size={48} />
             </div>
             <p className="text-slate-500 font-black uppercase tracking-widest text-lg">Hệ thống chưa tìm thấy công việc phù hợp.</p>
             <p className="text-slate-400 font-medium mt-2 italic px-4">Hãy thử tìm kiếm với các từ khóa khác hoặc quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs?.slice(0, 9).map((job: Job) => (
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
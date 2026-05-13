import { useLatestJobs, useTrendingJobs } from "../../job/api/job.api";
import { JobCard } from "@/components/shared/JobCard";
import { ChevronRight, Flame, Sparkles, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "../components/Hero";
import { StatsSection } from "../components/StatsSection";
import { CategorySection } from "../components/CategorySection";
import { FeaturedCompanies } from "../components/FeaturedCompanies";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { Newsletter } from "../components/Newsletter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/modules/user/hooks/useUser";

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Tất cả địa điểm");

  const { data: trendingJobs } = useTrendingJobs();
  const { data: latestJobsData } = useLatestJobs(6);
  const latestJobs = latestJobsData?.data || [];

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

      {/* Feature Showcase (Signature SmartCV) */}
      <FeatureShowcase />

      {/* Trending Jobs Section */}
      {trendingJobs && trendingJobs.length > 0 && (
        <div className="bg-slate-950 py-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
              <Flame size={400} className="text-primary animate-pulse" />
           </div>
           <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                       <Flame size={32} className="text-white" />
                    </div>
                    Việc làm <span className="text-primary">Xu hướng</span>
                  </h2>
                  <p className="text-slate-400 font-medium mt-6 ml-2 text-lg max-w-xl">Những cơ hội nghề nghiệp đang thu hút sự quan tâm lớn nhất từ cộng đồng ứng viên.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {trendingJobs.slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} isTrending={true} />
                ))}
              </div>

              <div className="mt-20 text-center">
                 <Button 
                   onClick={() => navigate('/jobs?sortBy=viewCount')}
                   className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] px-16 h-16 text-sm shadow-xl shadow-primary/20"
                 >
                    Xem tất cả việc làm xu hướng
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* Categories Section */}
      <CategorySection />

      {/* Latest Jobs Section */}
      {latestJobs.length > 0 && (
        <div className="py-40 bg-slate-50 relative">
           <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                 <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                       <Clock size={14} /> Cập nhật thời gian thực
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                       Cơ hội <br />
                       <span className="text-primary underline decoration-slate-200 underline-offset-8">Mới nhất</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-8 text-xl max-w-lg leading-relaxed">Đừng bỏ lỡ những công việc vừa được đăng tuyển trong 24h qua trên hệ thống.</p>
                 </div>
                 <Button 
                   variant="ghost" 
                   onClick={() => navigate('/jobs?sortBy=createdAt')}
                   className="font-black text-slate-400 hover:text-primary hover:bg-transparent transition-colors group uppercase tracking-[0.3em] text-xs pb-4"
                 >
                    Xem tất cả việc làm <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {latestJobs.map(job => (
                    <div key={job.id} className="hover:-translate-y-3 transition-transform duration-500">
                       <JobCard job={job} />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Featured Companies */}
      <FeaturedCompanies />

      {/* Improved Call to Action Section */}
      <div className="container mx-auto px-4 py-40">
        <div className="bg-slate-950 rounded-[5rem] p-12 md:p-28 border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row items-center justify-between gap-20 overflow-hidden relative">
           {/* Abstract Background */}
           <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[200px]"></div>
           </div>

           <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mb-10">
                Ready to Join?
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-10 leading-[0.85]">
                BẮT ĐẦU <br />
                <span className="text-primary underline decoration-slate-800 underline-offset-8">THÀNH CÔNG</span>
              </h2>
              <p className="text-slate-400 text-xl md:text-2xl font-medium mb-16 leading-relaxed max-w-2xl">
                Gia nhập hệ sinh thái SmartCV để tiếp cận những cơ hội nghề nghiệp hàng đầu hoặc tìm kiếm nhân tài phù hợp nhất cho doanh nghiệp.
              </p>
              
              <div className="flex flex-wrap gap-8">
                {user?.role === 'EMPLOYER' ? (
                   <>
                     <Button 
                        onClick={() => navigate('/employer/jobs/create')}
                        className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-14 h-20 text-base shadow-2xl shadow-primary/30 group transition-all hover:scale-105 active:scale-95"
                      >
                        Đăng tin ngay <ChevronRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => navigate('/employer/candidates')}
                        className="rounded-full border border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest px-14 h-20 text-base transition-all hover:scale-105 active:scale-95"
                      >
                        Tìm kiếm nhân tài
                      </Button>
                   </>
                ) : (
                   <>
                     <Button 
                        onClick={() => navigate('/jobs')}
                        className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-14 h-20 text-base shadow-2xl shadow-primary/30 group transition-all hover:scale-105 active:scale-95"
                      >
                        Khám phá việc làm <ChevronRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => navigate('/resumes')}
                        className="rounded-full border border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest px-14 h-20 text-base transition-all hover:scale-105 active:scale-95"
                      >
                        Thêm hồ sơ SmartCV
                      </Button>
                   </>
                )}
              </div>
           </div>

           <div className="relative z-10 flex-shrink-0 lg:block hidden">
              <div className="w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-[4rem] flex items-center justify-center rotate-12 border border-white/10 backdrop-blur-3xl relative">
                 <Sparkles size={120} className="text-primary animate-pulse" />
                 {/* Decorative dots */}
                 <div className="absolute top-8 right-8 w-3 h-3 bg-primary rounded-full"></div>
                 <div className="absolute bottom-12 left-8 w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

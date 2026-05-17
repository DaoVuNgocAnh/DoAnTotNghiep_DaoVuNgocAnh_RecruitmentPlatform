import { useRecommendedJobsCandidate } from "../api/job.api";
import { JobCard } from "@/components/shared/JobCard";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useUser } from "@/modules/user/hooks/useUser";
import { cn } from "@/lib/utils";

export const RecommendedJobs = () => {
  const { isAuthenticated } = useAuthStore();
  const { data: user } = useUser();
  const { data: jobs, isLoading } = useRecommendedJobsCandidate();

  console.log('AI Recommendation Debug:', { isAuthenticated, role: user?.role, jobsCount: jobs?.length });

  // Chỉ hiển thị cho ứng viên
  if (!isAuthenticated || user?.role !== 'CANDIDATE') return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) return null;

  const isAiMatched = (jobs as any)[0]?.isAiMatched;

  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                isAiMatched ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
              )}>
                <Sparkles size={18} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em]",
                isAiMatched ? "text-amber-600" : "text-blue-600"
              )}>
                {isAiMatched ? "Cá nhân hóa cho bạn" : "Có thể bạn quan tâm"}
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {isAiMatched ? (
                <>Việc làm <span className="text-primary">Gợi ý từ AI</span></>
              ) : (
                <>Việc làm <span className="text-primary">Mới nhất</span></>
              )}
            </h2>
            <p className="text-slate-500 font-medium italic mt-1">
              {isAiMatched 
                ? "Dựa trên kỹ năng và kinh nghiệm từ CV của bạn." 
                : "Chúng tôi chưa tìm thấy việc làm khớp 100%, hãy xem các vị trí mới nhất."}
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-primary">
              Xem tất cả <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

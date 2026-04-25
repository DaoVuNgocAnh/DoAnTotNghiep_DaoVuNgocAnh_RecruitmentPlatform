import { useAllJobs } from "../../job/api/job.api";
import type { Job } from "../../job/api/job.api"; // Import type
import { JobCard } from "@/components/shared/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Info } from "lucide-react";
import { useState } from "react";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const { data: jobs, isLoading } = useAllJobs({ search });

  return (
    <div className="bg-[#f4f7f6] min-h-screen pb-20">
      <div className="bg-[#001529] py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">
            Tìm việc làm <span className="text-[#00b14f]">Smart</span> ngay
          </h1>
          <p className="text-slate-400 font-medium mb-10 text-lg">Tiếp cận hàng nghìn cơ hội nghề nghiệp từ các công ty công nghệ hàng đầu.</p>
          
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 border-4 border-white/10 ring-1 ring-white/5">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={20} />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên công việc, vị trí, kỹ năng bạn muốn ứng tuyển..." 
                className="h-14 pl-12 rounded-xl border-none focus-visible:ring-0 text-slate-700 font-bold text-lg bg-transparent"
              />
            </div>
            <Button className="h-14 px-10 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-xl text-lg shadow-lg shadow-green-900/40">
              TÌM KIẾM
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight border-l-4 border-[#00b14f] pl-4">Việc làm mới nhất</h2>
            <p className="text-slate-500 font-medium text-sm mt-1 ml-4 italic">Cập nhật liên tục từ các doanh nghiệp uy tín</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#00b14f]" size={48} />
            <p className="font-bold text-slate-400 animate-pulse uppercase tracking-widest text-xs">Đang tìm kiếm cơ hội phù hợp cho bạn...</p>
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <Info className="mx-auto text-slate-300 mb-4" size={48} />
             <p className="text-slate-500 font-bold uppercase tracking-widest">Không tìm thấy công việc nào phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ĐỊNH NGHĨA KIỂU CHO JOB */}
            {jobs?.map((job: Job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
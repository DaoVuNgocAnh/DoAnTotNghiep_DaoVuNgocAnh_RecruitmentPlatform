import { useState } from "react";
import { useAllJobs, useJobCategories, useTrendingJobs } from "../api/job.api";
import { type Job } from "@/types/job.type";
import { JobCard } from "@/components/shared/JobCard";
import { Pagination } from "@/components/shared/Pagination";
import { 
  Search, 
  Loader2, 
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobFilters } from "../hooks/useJobFilters";
import { JobSearchHeader } from "../components/JobSearchHeader";
import { JobFilterSidebar } from "../components/JobFilterSidebar";
import { JobActiveFilters } from "../components/JobActiveFilters";

export const JobSearchPage = () => {
  const {
    filters,
    localSearch,
    setLocalSearch,
    updateFilters,
    handleSalaryClick,
    clearFilters,
    activeSalaryLabel,
  } = useJobFilters();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: categories } = useJobCategories();
  const { data: trendingJobs } = useTrendingJobs();
  const trendingJobIds = new Set(trendingJobs?.map((j: Job) => j.id) || []);

  const { data: jobsData, isLoading } = useAllJobs({
    ...filters,
    location: filters.location === "Tất cả địa điểm" ? undefined : filters.location,
    categoryId: filters.categoryId === "all" ? undefined : filters.categoryId,
    jobType: filters.jobType === "all" ? undefined : filters.jobType,
    isSalaryNegotiable: filters.isSalaryNegotiable ? true : undefined,
    limit: 10
  });

  const jobs = jobsData?.data || [];
  const meta = jobsData?.meta;

  return (
    <div className="bg-[#f4f7f6] min-h-screen pb-20">
      <JobSearchHeader 
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        location={filters.location}
        onUpdateFilters={updateFilters}
        onToggleMobileFilter={() => setIsFilterOpen(!isFilterOpen)}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <JobFilterSidebar 
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            categoryId={filters.categoryId}
            categories={categories}
            jobType={filters.jobType}
            isSalaryNegotiable={filters.isSalaryNegotiable}
            salaryMin={filters.salaryMin}
            salaryMax={filters.salaryMax}
            onUpdateFilters={updateFilters}
            onSalaryClick={handleSalaryClick}
            onClearFilters={clearFilters}
          />

          {/* Main Results */}
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 border border-slate-100 shadow-sm">
              <div className="text-slate-500 text-sm font-bold">
                Tìm thấy <span className="text-primary font-black">{meta?.total || 0}</span> việc làm phù hợp
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 mr-4 border-r pr-4 border-slate-100">
                   <Button variant="ghost" size="icon" className="text-primary bg-primary/10 rounded-lg"><LayoutGrid size={18} /></Button>
                   <Button variant="ghost" size="icon" className="text-slate-400 rounded-lg"><ListIcon size={18} /></Button>
                </div>
                
                <Select value={filters.sortBy} onValueChange={(val) => updateFilters({ sortBy: val })}>
                  <SelectTrigger className="w-[160px] border-none shadow-none font-bold text-slate-600 focus:ring-0">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown size={16} className="text-primary" />
                      <SelectValue placeholder="Sắp xếp" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Mới nhất</SelectItem>
                    <SelectItem value="viewCount">Xem nhiều nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <JobActiveFilters 
              search={filters.search}
              location={filters.location}
              categoryId={filters.categoryId}
              jobType={filters.jobType}
              activeSalaryLabel={activeSalaryLabel}
              categories={categories}
              onUpdateFilters={updateFilters}
            />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm gap-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="font-black uppercase tracking-[0.2em] text-xs text-slate-400">Đang đồng bộ cơ hội...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                   <Search size={48} />
                </div>
                <h3 className="text-xl font-black uppercase text-slate-800">Không tìm thấy kết quả</h3>
                <p className="text-slate-400 font-medium mt-2 max-w-md mx-auto italic">
                  Chúng tôi không tìm thấy việc làm nào phù hợp với các tiêu chí lọc của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa.
                </p>
                <Button onClick={clearFilters} className="mt-8 rounded-full px-8 h-12 bg-primary font-black uppercase tracking-widest">
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} isTrending={trendingJobIds.has(job.id)} />
                  ))}
                </div>

                {meta && meta.totalPages > 1 && (
                  <div className="pt-8">
                    <Pagination
                      currentPage={filters.page}
                      totalPages={meta.totalPages}
                      onPageChange={(p) => updateFilters({ page: p })}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

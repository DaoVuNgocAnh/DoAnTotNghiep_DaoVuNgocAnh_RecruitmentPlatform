import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAllJobs, useJobCategories, useTrendingJobs, type Job } from "../api/job.api";
import { JobCard } from "@/components/shared/JobCard";
import { Pagination } from "@/components/shared/Pagination";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Filter, 
  Loader2, 
  X, 
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCATIONS, JOB_TYPES, SALARY_RANGES } from "@/constants/job.constants";

export const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State từ URL
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "Tất cả địa điểm";
  const categoryId = searchParams.get("categoryId") || "all";
  const jobType = searchParams.get("jobType") || "all";
  const salaryMin = searchParams.get("salaryMin") ? parseInt(searchParams.get("salaryMin")!) : undefined;
  const salaryMax = searchParams.get("salaryMax") ? parseInt(searchParams.get("salaryMax")!) : undefined;
  const isSalaryNegotiable = searchParams.get("isSalaryNegotiable") === "true";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const page = parseInt(searchParams.get("page") || "1");

  // Local state cho form tìm kiếm
  const [localSearch, setLocalSearch] = useState(search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: categories } = useJobCategories();
  const { data: trendingJobs } = useTrendingJobs();
  const trendingJobIds = new Set(trendingJobs?.map((j: Job) => j.id) || []);

  const { data: jobsData, isLoading } = useAllJobs({
    search,
    location: location === "Tất cả địa điểm" ? undefined : location,
    categoryId: categoryId === "all" ? undefined : categoryId,
    jobType: jobType === "all" ? undefined : jobType,
    salaryMin,
    salaryMax,
    isSalaryNegotiable: isSalaryNegotiable ? true : undefined,
    sortBy,
    page,
    limit: 10
  });

  const jobs = jobsData?.data || [];
  const meta = jobsData?.meta;

  const updateFilters = (newFilters: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === "all" || value === "" || value === "Tất cả địa điểm" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    // Reset về trang 1 khi đổi bộ lọc
    if (!newFilters.page) params.set("page", "1");
    setSearchParams(params);
  };

  const handleSalaryClick = (range: any) => {
    if (range.isNegotiable) {
      updateFilters({ 
        isSalaryNegotiable: "true",
        salaryMin: null,
        salaryMax: null 
      });
    } else {
      updateFilters({ 
        isSalaryNegotiable: null,
        salaryMin: range.min, 
        salaryMax: range.max 
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  const clearFilters = () => {
    setLocalSearch("");
    setSearchParams({});
  };

  const activeSalaryLabel = isSalaryNegotiable 
    ? "Thỏa thuận" 
    : SALARY_RANGES.find(r => r.min === salaryMin && r.max === salaryMax && !r.isNegotiable)?.label;

  return (
    <div className="bg-[#f4f7f6] min-h-screen pb-20">
      {/* Header / Search Bar */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, công ty hoặc kỹ năng..."
                className="pl-12 h-14 rounded-2xl border-slate-200 focus:ring-primary/20 focus:border-primary font-bold text-slate-700"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={location} 
                onValueChange={(val) => updateFilters({ location: val })}
              >
                <SelectTrigger className="h-14 w-[180px] rounded-2xl border-slate-200 font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    <SelectValue placeholder="Địa điểm" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="submit" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                TÌM KIẾM
              </Button>

              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-14 px-4 rounded-2xl border-slate-200 lg:hidden"
              >
                <Filter size={20} />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`
            lg:w-80 space-y-6 lg:block
            ${isFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'}
          `}>
            {isFilterOpen && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-black uppercase">Bộ lọc nâng cao</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                  <X />
                </Button>
              </div>
            )}

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-8">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" /> Ngành nghề
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  <button
                    onClick={() => updateFilters({ categoryId: "all" })}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      categoryId === "all" 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Tất cả ngành nghề
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilters({ categoryId: cat.id })}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        categoryId === cat.id 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="pt-6 border-t border-slate-50">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                   <Clock size={16} className="text-primary" /> Loại hình công việc
                </h3>
                <div className="space-y-2">
                   <button
                    onClick={() => updateFilters({ jobType: "all" })}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      jobType === "all" 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Tất cả loại hình
                  </button>
                   {JOB_TYPES.map(type => (
                     <button
                      key={type.value}
                      onClick={() => updateFilters({ jobType: type.value })}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        jobType === type.value 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {type.label}
                    </button>
                   ))}
                </div>
              </div>

              {/* Salary Filter */}
              <div className="pt-6 border-t border-slate-50">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                   <Filter size={16} className="text-primary" /> Mức lương
                </h3>
                <div className="space-y-2">
                   {SALARY_RANGES.map(range => {
                     const isActive = range.isNegotiable 
                       ? isSalaryNegotiable 
                       : (!range.min && !range.max && !isSalaryNegotiable && !salaryMin && !salaryMax) || 
                         (range.min === salaryMin && range.max === salaryMax && !isSalaryNegotiable);

                     return (
                       <button
                          key={range.label}
                          onClick={() => handleSalaryClick(range)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            isActive
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {range.label}
                        </button>
                     );
                   })}
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="w-full text-slate-400 hover:text-primary font-bold transition-colors pt-4"
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          </aside>

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
                
                <Select value={sortBy} onValueChange={(val) => updateFilters({ sortBy: val })}>
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

            {/* Active Filters */}
            {(search || location !== "Tất cả địa điểm" || categoryId !== "all" || jobType !== "all" || activeSalaryLabel !== "Tất cả mức lương") && (
              <div className="flex flex-wrap gap-2 items-center">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-2">Đang lọc:</span>
                 {search && (
                   <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
                     "{search}" <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => updateFilters({ search: "" })} />
                   </Badge>
                 )}
                 {location !== "Tất cả địa điểm" && (
                   <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
                     {location} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => updateFilters({ location: "all" })} />
                   </Badge>
                 )}
                 {categoryId !== "all" && (
                   <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
                     {categories?.find(c => c.id === categoryId)?.name} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => updateFilters({ categoryId: "all" })} />
                   </Badge>
                 )}
                 {jobType !== "all" && (
                   <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
                     {JOB_TYPES.find(t => t.value === jobType)?.label} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => updateFilters({ jobType: "all" })} />
                   </Badge>
                 )}
                 {activeSalaryLabel && activeSalaryLabel !== "Tất cả mức lương" && (
                   <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
                     {activeSalaryLabel} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => updateFilters({ salaryMin: null, salaryMax: null, isSalaryNegotiable: null })} />
                   </Badge>
                 )}
              </div>
            )}

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
                      currentPage={page}
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

import { Briefcase, Clock, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JOB_TYPES, SALARY_RANGES } from "@/constants/job.constants";
import { type JobCategory } from "@/types/job.type";

interface JobFilterSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (val: boolean) => void;
  categoryId: string;
  categories: JobCategory[] | undefined;
  jobType: string;
  isSalaryNegotiable: boolean;
  salaryMin?: number;
  salaryMax?: number;
  onUpdateFilters: (filters: any) => void;
  onSalaryClick: (range: any) => void;
  onClearFilters: () => void;
}

export const JobFilterSidebar = ({
  isFilterOpen,
  setIsFilterOpen,
  categoryId,
  categories,
  jobType,
  isSalaryNegotiable,
  salaryMin,
  salaryMax,
  onUpdateFilters,
  onSalaryClick,
  onClearFilters,
}: JobFilterSidebarProps) => {
  return (
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
              onClick={() => onUpdateFilters({ categoryId: "all" })}
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
                onClick={() => onUpdateFilters({ categoryId: cat.id })}
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
              onClick={() => onUpdateFilters({ jobType: "all" })}
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
                onClick={() => onUpdateFilters({ jobType: type.value })}
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
                    onClick={() => onSalaryClick(range)}
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
          onClick={onClearFilters}
          className="w-full text-slate-400 hover:text-primary font-bold transition-colors pt-4"
        >
          Xóa tất cả bộ lọc
        </Button>
      </div>
    </aside>
  );
};

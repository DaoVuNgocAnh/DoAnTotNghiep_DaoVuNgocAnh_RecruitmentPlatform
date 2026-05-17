import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JOB_TYPES } from "@/constants/job.constants";
import { type JobCategory } from "@/types/job.type";

interface JobActiveFiltersProps {
  search: string;
  location: string;
  categoryId: string;
  jobType: string;
  activeSalaryLabel: string | undefined;
  categories: JobCategory[] | undefined;
  onUpdateFilters: (filters: any) => void;
}

export const JobActiveFilters = ({
  search,
  location,
  categoryId,
  jobType,
  activeSalaryLabel,
  categories,
  onUpdateFilters,
}: JobActiveFiltersProps) => {
  const hasFilters = search || location !== "Tất cả địa điểm" || categoryId !== "all" || jobType !== "all" || (activeSalaryLabel && activeSalaryLabel !== "Tất cả mức lương");

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-2">Đang lọc:</span>
      {search && (
        <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
          "{search}" <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => onUpdateFilters({ search: "" })} />
        </Badge>
      )}
      {location !== "Tất cả địa điểm" && (
        <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
          {location} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => onUpdateFilters({ location: "all" })} />
        </Badge>
      )}
      {categoryId !== "all" && (
        <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
          {categories?.find(c => c.id === categoryId)?.name} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => onUpdateFilters({ categoryId: "all" })} />
        </Badge>
      )}
      {jobType !== "all" && (
        <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
          {JOB_TYPES.find(t => t.value === jobType)?.label} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => onUpdateFilters({ jobType: "all" })} />
        </Badge>
      )}
      {activeSalaryLabel && activeSalaryLabel !== "Tất cả mức lương" && (
        <Badge variant="secondary" className="bg-white border-slate-100 text-slate-600 rounded-lg px-3 py-1 gap-2">
          {activeSalaryLabel} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => onUpdateFilters({ salaryMin: null, salaryMax: null, isSalaryNegotiable: null })} />
        </Badge>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SALARY_RANGES } from "@/constants/job.constants";

export const useJobFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State from URL
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "Tất cả địa điểm";
  const categoryId = searchParams.get("categoryId") || "all";
  const jobType = searchParams.get("jobType") || "all";
  const salaryMin = searchParams.get("salaryMin") ? parseInt(searchParams.get("salaryMin")!) : undefined;
  const salaryMax = searchParams.get("salaryMax") ? parseInt(searchParams.get("salaryMax")!) : undefined;
  const isSalaryNegotiable = searchParams.get("isSalaryNegotiable") === "true";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const page = parseInt(searchParams.get("page") || "1");

  // Local state for search input
  const [localSearch, setLocalSearch] = useState(search);

  // Sync localSearch when URL search param changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const updateFilters = (newFilters: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === "all" || value === "" || value === "Tất cả địa điểm" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    // Reset to page 1 when filters change (unless page is specifically being set)
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

  const clearFilters = () => {
    setLocalSearch("");
    setSearchParams({});
  };

  const activeSalaryLabel = isSalaryNegotiable 
    ? "Thỏa thuận" 
    : SALARY_RANGES.find(r => r.min === salaryMin && r.max === salaryMax && !r.isNegotiable)?.label;

  const hasActiveFilters = search || location !== "Tất cả địa điểm" || categoryId !== "all" || jobType !== "all" || (activeSalaryLabel && activeSalaryLabel !== "Tất cả mức lương");

  return {
    filters: {
      search,
      location,
      categoryId,
      jobType,
      salaryMin,
      salaryMax,
      isSalaryNegotiable,
      sortBy,
      page,
    },
    localSearch,
    setLocalSearch,
    updateFilters,
    handleSalaryClick,
    clearFilters,
    activeSalaryLabel,
    hasActiveFilters,
  };
};

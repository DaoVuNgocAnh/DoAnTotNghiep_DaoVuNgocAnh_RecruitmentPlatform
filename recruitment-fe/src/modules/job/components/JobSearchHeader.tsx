import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCATIONS } from "@/constants/job.constants";

interface JobSearchHeaderProps {
  localSearch: string;
  setLocalSearch: (val: string) => void;
  location: string;
  onUpdateFilters: (filters: any) => void;
  onToggleMobileFilter: () => void;
}

export const JobSearchHeader = ({
  localSearch,
  setLocalSearch,
  location,
  onUpdateFilters,
  onToggleMobileFilter,
}: JobSearchHeaderProps) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilters({ search: localSearch });
  };

  return (
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
              onValueChange={(val) => onUpdateFilters({ location: val })}
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
              onClick={onToggleMobileFilter}
              className="h-14 px-4 rounded-2xl border-slate-200 lg:hidden"
            >
              <Filter size={20} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

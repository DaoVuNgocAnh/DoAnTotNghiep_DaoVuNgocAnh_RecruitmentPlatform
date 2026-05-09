import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin, Building2, ArrowUpRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/modules/job/api/job.api";
import { SaveButton } from "@/modules/saved-items/components/SaveButton";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  variant?: 'grid' | 'list';
}

export const JobCard = ({ job, variant = 'grid' }: JobCardProps) => {
  const isList = variant === 'list';

  return (
    <div className={cn("relative group", job.isFeatured && "animate-in fade-in duration-700")}>
      <Link to={`/jobs/${job.id}`}>
        <Card className={cn(
          "transition-all duration-500 border-transparent shadow-sm hover:shadow-2xl hover:shadow-primary/10 cursor-pointer bg-white active:scale-[0.98] border-l-4",
          isList ? "flex flex-row p-4 gap-6 items-center" : "flex flex-col p-6 rounded-[2rem]",
          job.isFeatured 
            ? "border-l-amber-500 bg-gradient-to-r from-amber-50/30 to-transparent shadow-amber-100/50" 
            : "hover:border-l-primary"
        )}>
          {/* Logo Section */}
          <div className={cn(
            "rounded-2xl border border-slate-100 flex-shrink-0 flex items-center justify-center bg-white shadow-sm transition-all group-hover:border-primary/20",
            isList ? "w-24 h-24 p-3" : "w-20 h-20 p-4 mb-6"
          )}>
            {job.company.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="text-slate-300" size={32} />
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <h3 className={cn(
                "font-black text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2 uppercase tracking-tight",
                isList ? "text-lg" : "text-base mb-2"
              )}>
                {job.title}
              </h3>
              {!isList && (
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-sm">
                  <ArrowUpRight size={20} />
                </div>
              )}
            </div>

            <p className="text-xs font-black text-slate-400 mt-1 truncate uppercase tracking-widest">
              {job.company.name}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 items-center">
              <div className="flex items-center gap-1.5 text-primary font-black text-sm uppercase tracking-tighter">
                <DollarSign size={14} className="shrink-0" /> {job.salary}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px] uppercase tracking-wide">
                <MapPin size={14} className="shrink-0 text-blue-500" /> {job.location}
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-6">
               <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded-lg">
                  {job.category.name}
               </Badge>
               {job.isFeatured && (
                 <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-none text-[9px] font-black px-3 py-1 uppercase tracking-[0.1em] flex items-center gap-1.5 rounded-lg shadow-lg shadow-amber-200 animate-pulse">
                    <Flame size={12} className="fill-current" /> Hot Job
                 </Badge>
               )}
            </div>
          </div>

          {/* List Variant Action */}
          {isList && (
            <div className="flex flex-col items-end gap-3 pl-6 border-l border-slate-100 ml-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-sm">
                  <ArrowUpRight size={24} />
               </div>
            </div>
          )}
        </Card>
      </Link>
      
      {/* Save Button */}
      <div className={cn(
        "absolute z-10",
        isList ? "top-6 right-20" : "top-8 right-8"
      )}>
        <SaveButton 
          targetId={job.id} 
          targetType="JOB" 
          className="bg-white/80 backdrop-blur-md border-slate-100 shadow-sm hover:border-rose-200 hover:text-rose-500 rounded-xl w-10 h-10" 
        />
      </div>
    </div>
  );
};

// src/components/shared/JobCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin, Building2, Calendar, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/modules/job/api/job.api";

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <Link to={`/jobs/${job.id}`}>
      <Card className="group relative hover:shadow-[0_20px_50px_rgba(0,177,79,0.15)] transition-all duration-500 border-slate-100 rounded-[2rem] overflow-hidden cursor-pointer bg-white active:scale-[0.98] border-2 hover:border-[#00b14f]/20">
        <CardContent className="p-8 flex flex-col gap-6">
          {/* Header: Logo & Hot Badge */}
          <div className="flex justify-between items-start">
            <div className="w-20 h-20 rounded-3xl border-2 border-slate-50 flex-shrink-0 flex items-center justify-center p-3 group-hover:border-[#00b14f]/20 transition-all bg-white shadow-sm group-hover:shadow-lg group-hover:shadow-green-500/5">
              {job.company.logoUrl ? (
                <img src={job.company.logoUrl} alt="logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Building2 className="text-slate-200" size={40} />
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
               <Badge className="bg-orange-50 text-orange-500 hover:bg-orange-50 border-none font-black text-[10px] py-1 px-3 uppercase tracking-widest">Hot Job</Badge>
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#00b14f] group-hover:text-white transition-all">
                  <ArrowUpRight size={20} />
               </div>
            </div>
          </div>

          {/* Body: Title & Company */}
          <div>
            <h3 className="font-black text-slate-800 group-hover:text-[#00b14f] transition-colors uppercase text-lg tracking-tight leading-tight mb-2 line-clamp-2 min-h-[3rem]">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 mb-6">
              <Building2 size={14} className="text-slate-400" />
              <p className="text-sm font-bold uppercase tracking-tight truncate">
                {job.company.name}
              </p>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-green-50 text-[#00b14f] font-black text-xs uppercase tracking-tighter border border-green-100/50">
                <DollarSign size={14} /> {job.salary}
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-tighter border border-blue-100/50">
                <MapPin size={14} /> {job.location}
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center group-hover:bg-green-50/30 transition-colors">
             <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <Calendar size={12} className="text-slate-300" /> 
                <span>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
             </div>
             <div className="h-2 w-2 rounded-full bg-[#00b14f] animate-pulse" />
        </div>
      </Card>
    </Link>
  );
};
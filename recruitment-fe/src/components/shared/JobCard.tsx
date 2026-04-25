import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin, Building2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/modules/job/api/job.api"; // Thêm chữ 'type' ở đây

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <Link to={`/jobs/${job.id}`}>
      <Card className="group hover:shadow-2xl transition-all duration-300 border-slate-100 rounded-2xl overflow-hidden cursor-pointer bg-white active:scale-[0.98]">
        <CardContent className="p-5 flex gap-4">
          {/* Logo Công ty */}
          <div className="w-16 h-16 rounded-xl border border-slate-100 flex-shrink-0 flex items-center justify-center p-2 group-hover:border-[#00b14f]/30 transition-colors bg-slate-50">
            {job.company.logoUrl ? (
              <img src={job.company.logoUrl} alt="logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <Building2 className="text-slate-300" size={32} />
            )}
          </div>

          {/* Thông tin Job */}
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-slate-800 truncate group-hover:text-[#00b14f] transition-colors uppercase text-sm tracking-tight leading-tight mb-1">
              {job.title}
            </h3>
            <p className="text-xs font-bold text-slate-500 truncate mb-3 uppercase tracking-tighter italic">
              {job.company.name}
            </p>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-bold text-[10px] py-0.5 px-2">
                <DollarSign size={10} className="mr-1 text-[#00b14f]" /> {job.salary}
              </Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-bold text-[10px] py-0.5 px-2">
                <MapPin size={10} className="mr-1 text-blue-500" /> {job.location}
              </Badge>
            </div>
          </div>
        </CardContent>
        <div className="px-5 py-2 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} /> Cập nhật: {new Date(job.createdAt).toLocaleDateString('vi-VN')}
             </span>
             <span className="text-[10px] text-[#00b14f] font-black group-hover:underline">ỨNG TUYỂN NGAY</span>
        </div>
      </Card>
    </Link>
  );
};
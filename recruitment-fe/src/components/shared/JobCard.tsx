// src/components/shared/JobCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin } from "lucide-react";

interface JobCardProps {
  job: any; // Sau này sẽ dùng Type Job chuẩn
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden cursor-pointer active:scale-[0.98]">
      <CardContent className="p-5 flex gap-4">
        {/* Logo Công ty */}
        <div className="w-16 h-16 rounded-xl border border-slate-100 flex-shrink-0 flex items-center justify-center p-2 group-hover:border-[#00b14f]/30 transition-colors">
          <img src={job.companyLogo || "/placeholder-company.png"} alt="logo" className="max-w-full max-h-full object-contain" />
        </div>

        {/* Thông tin Job */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate group-hover:text-[#00b14f] transition-colors uppercase text-sm">
            {job.title}
          </h3>
          <p className="text-xs text-slate-500 truncate mb-2">{job.companyName}</p>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-medium py-0.5">
              <DollarSign size={12} className="mr-1" /> {job.salary}
            </Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-medium py-0.5">
              <MapPin size={12} className="mr-1" /> {job.location}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
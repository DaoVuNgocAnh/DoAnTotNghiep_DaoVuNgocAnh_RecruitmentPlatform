import { useParams, useNavigate } from "react-router-dom";
import { useJobDetail } from "../../job/api/job.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, DollarSign, Clock, Building2, ChevronLeft, Send, ShieldCheck } from "lucide-react";
import { Loader2 } from "lucide-react";

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJobDetail(id!);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>;
  if (!job) return <div>Không tìm thấy việc làm</div>;

  return (
    <div className="bg-[#f4f7f6] min-h-screen py-8 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 hover:bg-slate-200 rounded-xl gap-2 font-bold text-slate-500">
           <ChevronLeft size={18} /> QUAY LẠI
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: CHI TIẾT CÔNG VIỆC */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
               <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4 leading-tight">{job.title}</h1>
               <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border">
                     <DollarSign className="text-[#00b14f]" size={18} />
                     <span>Lương: {job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border">
                     <MapPin className="text-blue-500" size={18} />
                     <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border">
                     <Clock className="text-orange-500" size={18} />
                     <span>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
               </div>

               <Separator className="mb-8" />

               <div className="space-y-10">
                  <section>
                    <h2 className="text-lg font-black text-[#00b14f] uppercase tracking-widest mb-4 border-l-4 border-[#00b14f] pl-4">Mô tả công việc</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{job.description}</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-black text-[#00b14f] uppercase tracking-widest mb-4 border-l-4 border-[#00b14f] pl-4">Yêu cầu ứng viên</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{job.requirement}</p>
                  </section>
               </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CÔNG TY & ACTIONS */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center">
               <div className="w-24 h-24 mx-auto mb-6 bg-slate-50 rounded-3xl border flex items-center justify-center p-4">
                  {job.company.logoUrl ? (
                    <img src={job.company.logoUrl} className="max-w-full max-h-full object-contain" />
                  ) : <Building2 size={40} className="text-slate-300" />}
               </div>
               <h3 className="font-black text-slate-800 uppercase text-lg tracking-tight mb-2 leading-tight">{job.company.name}</h3>
               <Badge className="bg-green-50 text-[#00b14f] hover:bg-green-50 border-none font-black text-[10px] px-3 mb-6 ring-1 ring-[#00b14f]/20 uppercase">
                  Verified Business
               </Badge>
               <Button className="w-full h-12 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-xl gap-2 shadow-xl shadow-green-100 mb-3">
                  <Send size={18} /> ỨNG TUYỂN NGAY
               </Button>
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Hợp đồng bảo mật SmartCV
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
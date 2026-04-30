import { useParams, useNavigate } from "react-router-dom";
import { useJobDetail } from "../../job/api/job.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, DollarSign, Clock, Building2, ChevronLeft, ShieldCheck, Loader2 } from "lucide-react";
import { ApplyModal } from "../components/ApplyModal"; // Đảm bảo bạn đã tạo file này
import { useUser } from "@/modules/user/hooks/useUser";

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJobDetail(id!);
  const { data: user } = useUser();

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#f4f7f6]"><Loader2 className="animate-spin text-[#00b14f]" size={40} /></div>;
  if (!job) return <div className="h-screen flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest">Không tìm thấy việc làm</div>;

  return (
    <div className="bg-[#f4f7f6] min-h-screen py-8 px-4 font-sans animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 hover:bg-slate-200 rounded-xl gap-2 font-bold text-slate-500 group transition-all"
        >
           <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> QUAY LẠI
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: CHI TIẾT CÔNG VIỆC */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100">
               <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4 leading-tight">{job.title}</h1>
               
               <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                     <DollarSign className="text-[#00b14f]" size={18} />
                     <span>Lương: {job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                     <MapPin className="text-blue-500" size={18} />
                     <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                     <Clock className="text-orange-500" size={18} />
                     <span>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
               </div>

               <Separator className="mb-8 opacity-50" />

               <div className="space-y-10">
                  <section>
                    <h2 className="text-lg font-black text-[#001529] uppercase tracking-widest mb-4 border-l-4 border-[#00b14f] pl-4">Mô tả công việc</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{job.description}</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-black text-[#001529] uppercase tracking-widest mb-4 border-l-4 border-[#00b14f] pl-4">Yêu cầu ứng viên</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{job.requirement}</p>
                  </section>
               </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CÔNG TY & ACTIONS */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 text-center sticky top-24">
               <div className="w-24 h-24 mx-auto mb-6 bg-slate-50 rounded-3xl border-2 border-white shadow-md flex items-center justify-center p-4 overflow-hidden">
                  {job.company.logoUrl ? (
                    <img src={job.company.logoUrl} alt="company logo" className="max-w-full max-h-full object-contain" />
                  ) : <Building2 size={40} className="text-slate-300" />}
               </div>
               <h3 className="font-black text-slate-800 uppercase text-lg tracking-tight mb-2 leading-tight">{job.company.name}</h3>
               <Badge className="bg-green-50 text-[#00b14f] hover:bg-green-50 border-none font-black text-[10px] px-3 mb-8 ring-1 ring-[#00b14f]/20 uppercase">
                  Verified Business
               </Badge>

               {/* CHỈ HIỆN MODAL ỨNG TUYỂN NẾU LÀ CANDIDATE HOẶC GUEST */}
               {user?.role !== 'EMPLOYER' && user?.role !== 'ADMIN' ? (
                  <ApplyModal jobId={job.id} jobTitle={job.title} />
               ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-400 font-bold uppercase italic border border-dashed">
                     Chế độ xem trước dành cho quản trị
                  </div>
               )}

               <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                  <ShieldCheck size={14} className="text-[#00b14f]" />
                  <p className="text-[10px] uppercase font-black tracking-widest">Bảo mật bởi SmartCV</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
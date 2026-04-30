import { useState } from 'react';
import { useResumes } from '@/modules/resume/api/resume.api';
import { useApplyJob } from '../../application/api/application.api';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Loader2, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from 'react-router-dom';

export const ApplyModal = ({ jobId, jobTitle }: { jobId: string, jobTitle: string }) => {
  const { data: resumes, isLoading } = useResumes();
  const applyMutation = useApplyJob();
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const defaultResume = resumes?.find(r => r.isDefault);

  const handleApply = () => {
    const resumeId = selectedResume || defaultResume?.id;
    if (!resumeId) return toast.error("Vui lòng chọn một bản CV");

    applyMutation.mutate({ jobId, resumeId }, {
      onSuccess: () => {
        toast.success("Ứng tuyển thành công!");
        setOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Lỗi khi nộp đơn");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-xl gap-2 shadow-xl shadow-green-900/20 active:scale-95 transition-all uppercase">
           <Send size={18} /> Ứng tuyển ngay
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] max-w-lg border-none shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-black uppercase text-[#001529]">Ứng tuyển vị trí</DialogTitle>
          <p className="text-sm font-bold text-[#00b14f] uppercase tracking-tight">{jobTitle}</p>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Danh sách CV của bạn:</h4>
          
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#00b14f]" /></div>
          ) : !resumes || resumes.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <AlertCircle className="mx-auto text-slate-300 mb-2" />
               <p className="text-xs font-bold text-slate-500">Bạn chưa có CV nào trên hệ thống</p>
               <Link to="/resumes" className="text-[#00b14f] text-xs font-black hover:underline mt-2 inline-block">TẠI ĐÂY ĐỂ TẢI LÊN</Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {resumes.map(resume => (
                <div 
                  key={resume.id}
                  onClick={() => setSelectedResume(resume.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                    (selectedResume === resume.id || (!selectedResume && resume.isDefault)) 
                    ? "border-[#00b14f] bg-green-50/30" : "border-slate-100 hover:border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                       (selectedResume === resume.id || (!selectedResume && resume.isDefault)) ? "bg-[#00b14f] text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <span className="font-black text-sm text-slate-800 uppercase block leading-none">{resume.resumeName}</span>
                        {resume.isDefault && <span className="text-[9px] font-bold text-[#00b14f] uppercase tracking-tighter mt-1 block">CV mặc định</span>}
                    </div>
                  </div>
                  {(selectedResume === resume.id || (!selectedResume && resume.isDefault)) && (
                    <CheckCircle2 size={20} className="text-[#00b14f] animate-in zoom-in duration-300" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button 
          disabled={applyMutation.isPending || !resumes || resumes.length === 0} 
          onClick={handleApply}
          className="w-full h-14 bg-[#00b14f] hover:bg-[#009643] font-black rounded-2xl text-lg shadow-lg shadow-green-100 uppercase"
        >
          {applyMutation.isPending ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle2 className="mr-2" size={20}/>}
          Xác nhận nộp đơn
        </Button>
      </DialogContent>
    </Dialog>
  );
};
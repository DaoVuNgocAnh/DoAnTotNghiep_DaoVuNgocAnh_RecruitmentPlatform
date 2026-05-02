import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/modules/user/api/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, FileText, Loader2, ExternalLink, Briefcase, Award, User, Sparkles, Calendar } from "lucide-react";
import { SaveButton } from "@/modules/saved-items/components/SaveButton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const CandidateDetailPage = () => {
  const { id } = useParams();
  
  const { data: candidate, isLoading } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => userApi.getCandidateById(id!).then(res => res.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#00b14f]" size={32} /></div>;
  if (!candidate) return <div className="text-center py-20">Không tìm thấy ứng viên.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20">
      {/* Header Profile */}
      <div className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-bl-full -mr-16 -mt-16 z-0" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
          <div className="relative group">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-4 border-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-105">
              <AvatarImage src={candidate.avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-green-100 text-[#00b14f] text-4xl font-black">{candidate.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
                <SaveButton targetId={candidate.id} targetType="CANDIDATE" className="h-12 w-12 shadow-lg bg-white border-none" />
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">{candidate.fullName}</h1>
                <Badge className="bg-green-50 text-[#00b14f] border-none px-3 font-bold uppercase text-[10px] tracking-widest h-6">Ứng viên tiềm năng</Badge>
            </div>
            
            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">{candidate.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 pt-2">
               <span className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <Phone size={14} className="text-[#00b14f]"/> {candidate.phone || "Chưa cập nhật"}
               </span>
               <span className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <Calendar size={14} className="text-[#00b14f]"/> {candidate.dateOfBirth ? format(new Date(candidate.dateOfBirth), 'dd/MM/yyyy', { locale: vi }) : "Chưa cập nhật"}
               </span>
               <span className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <MapPin size={14} className="text-[#00b14f]"/> {candidate.address || "Chưa cập nhật"}
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Bio & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2.5rem] shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="font-black uppercase text-xs tracking-[0.2em] text-slate-900 flex items-center gap-3">
                <User size={18} className="text-[#00b14f]"/> Giới thiệu bản thân
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line italic">
                {candidate.bio || "Ứng viên này chưa cập nhật thông tin giới thiệu bản thân."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="font-black uppercase text-xs tracking-[0.2em] text-slate-900 flex items-center gap-3">
                <Award size={18} className="text-[#00b14f]"/> Kỹ năng nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {candidate.skills ? candidate.skills.split(',').map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-[#00b14f] hover:text-white transition-colors border-none py-1.5 px-4 rounded-xl font-bold uppercase text-[10px] tracking-wider">
                        <Sparkles size={10} className="mr-1.5"/> {skill.trim()}
                    </Badge>
                )) : (
                    <p className="text-slate-400 text-sm font-medium italic">Chưa cập nhật kỹ năng.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Submitted Resumes */}
        <div className="space-y-6">
            <Card className="rounded-[2.5rem] shadow-sm border-slate-100 overflow-hidden h-full">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="font-black uppercase text-xs tracking-[0.2em] text-slate-900 flex items-center gap-3">
                    <FileText size={18} className="text-[#00b14f]"/> Hồ sơ ứng tuyển
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                {candidate.resumes?.length > 0 ? (
                    candidate.resumes.map((resume: any) => (
                        <div key={resume.id} className="group p-5 bg-white rounded-3xl border-2 border-slate-50 hover:border-green-100 hover:bg-green-50/30 transition-all duration-300">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="p-2.5 bg-green-50 rounded-2xl text-[#00b14f] group-hover:bg-[#00b14f] group-hover:text-white transition-colors shadow-sm">
                                    <FileText size={20} />
                                </div>
                                <Button variant="ghost" size="icon" asChild className="rounded-xl h-8 w-8 hover:bg-white hover:text-[#00b14f]">
                                    <a href={resume.fileUrl} target="_blank" rel="noreferrer">
                                        <ExternalLink size={16} />
                                    </a>
                                </Button>
                            </div>
                            
                            <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight line-clamp-1">{resume.resumeName}</h4>
                            
                            <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                    <Briefcase size={12} className="text-[#00b14f]" /> 
                                    <span>Vị trí: {resume.jobTitle}</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    Ngày nộp: {format(new Date(resume.applyDate), "dd/MM/yyyy", { locale: vi })}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 px-6">
                        <FileText size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed">Ứng viên chưa nộp bất kỳ hồ sơ nào cho công ty bạn.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

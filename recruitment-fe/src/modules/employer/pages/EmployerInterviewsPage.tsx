import { useEmployerInterviews, InterviewStatus } from '@/modules/interview/api/interview.api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  CalendarCheck2,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const EmployerInterviewsPage = () => {
  const { data: interviews, isLoading } = useEmployerInterviews();

  const getStatusInfo = (status: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.PENDING:
        return { label: 'CHỜ PHẢN HỒI', color: 'bg-yellow-50 text-yellow-600 ring-yellow-500/20', icon: Clock };
      case InterviewStatus.CONFIRMED:
        return { label: 'ĐÃ XÁC NHẬN', color: 'bg-green-50 text-green-600 ring-green-500/20', icon: CheckCircle2 };
      case InterviewStatus.DECLINED:
        return { label: 'ĐÃ TỪ CHỐI', color: 'bg-red-50 text-red-600 ring-red-500/20', icon: XCircle };
      default:
        return { label: 'KHÔNG XÁC ĐỊNH', color: 'bg-slate-50 text-slate-500', icon: Clock };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-[#001529] uppercase tracking-tight border-l-4 border-[#00b14f] pl-4">
          Lịch phỏng vấn
        </h1>
        <p className="text-slate-500 text-sm font-medium ml-4 italic">
          Quản lý các buổi hẹn phỏng vấn với ứng viên.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#00b14f]" size={40} />
        </div>
      ) : !interviews || interviews.length === 0 ? (
        <Card className="border-dashed border-2 py-20 text-center rounded-[2rem] bg-slate-50/50">
          <Calendar className="mx-auto text-slate-300 mb-4 opacity-20" size={64} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
            Hiện tại chưa có lịch phỏng vấn nào được tạo.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => {
            const statusInfo = getStatusInfo(interview.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={interview.id} className="group rounded-[2rem] border-2 border-slate-100 hover:border-[#00b14f]/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-green-50 overflow-hidden bg-white">
                <div className={cn("h-1.5 w-full", 
                  interview.status === InterviewStatus.PENDING ? "bg-yellow-400" :
                  interview.status === InterviewStatus.CONFIRMED ? "bg-green-500" : "bg-red-500"
                )} />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Badge className={cn("font-black text-[9px] px-3 py-1 ring-1 border-none uppercase tracking-widest gap-1.5", statusInfo.color)}>
                      <StatusIcon size={10} /> {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                        <User size={20} className="text-[#001529] group-hover:text-[#00b14f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ứng viên</p>
                        <p className="font-black text-slate-800 uppercase text-sm truncate">{interview.application.candidate?.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                        <Briefcase size={20} className="text-[#001529] group-hover:text-[#00b14f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Vị trí ứng tuyển</p>
                        <p className="font-black text-slate-800 text-xs line-clamp-2 uppercase leading-tight">{interview.application.job.title}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <CalendarCheck2 size={16} className="text-[#00b14f]" />
                        <span className="text-xs font-black text-slate-700 uppercase italic">
                          {format(new Date(interview.interviewDate), 'eeee, dd/MM/yyyy', { locale: vi })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock size={16} className="text-[#00b14f]" />
                        <span className="text-xs font-black text-slate-700 uppercase italic">
                          {format(new Date(interview.interviewDate), 'HH:mm', { locale: vi })}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MapPin size={16} className="text-[#00b14f] shrink-0" />
                        <span className="text-xs font-bold text-slate-500 leading-snug">
                          {interview.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

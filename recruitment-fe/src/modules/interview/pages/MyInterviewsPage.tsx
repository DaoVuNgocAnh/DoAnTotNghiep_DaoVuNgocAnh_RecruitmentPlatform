import { useMyInterviews, useUpdateInterviewStatus, InterviewStatus } from '../api/interview.api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  CalendarCheck2,
  Briefcase,
  Building2,
  Check,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const MyInterviewsPage = () => {
  const { data: interviews, isLoading } = useMyInterviews();
  const updateStatusMutation = useUpdateInterviewStatus();

  const handleUpdateStatus = (id: string, status: InterviewStatus) => {
    const action = status === InterviewStatus.CONFIRMED ? 'Xác nhận' : 'Từ chối';
    updateStatusMutation.mutate({ id, status }, {
      onSuccess: () => toast.success(`${action} lịch phỏng vấn thành công`),
      onError: () => toast.error('Thao tác thất bại'),
    });
  };

  const getStatusInfo = (status: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.PENDING:
        return { label: 'CHỜ BẠN XÁC NHẬN', color: 'bg-yellow-50 text-yellow-600 ring-yellow-500/20', icon: Clock };
      case InterviewStatus.CONFIRMED:
        return { label: 'BẠN ĐÃ XÁC NHẬN', color: 'bg-green-50 text-green-600 ring-green-500/20', icon: CheckCircle2 };
      case InterviewStatus.DECLINED:
        return { label: 'BẠN ĐÃ TỪ CHỐI', color: 'bg-red-50 text-red-600 ring-red-500/20', icon: XCircle };
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#001529] uppercase tracking-tight">
          Lịch phỏng vấn của tôi
        </h1>
        <p className="text-slate-500 font-medium italic">
          Xem và xác nhận các lời mời phỏng vấn từ nhà tuyển dụng.
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
            Bạn chưa có lời mời phỏng vấn nào.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((interview) => {
            const statusInfo = getStatusInfo(interview.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={interview.id} className="group rounded-[2rem] border-2 border-slate-100 hover:border-[#00b14f]/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-green-50 overflow-hidden bg-white flex flex-col">
                <div className={cn("h-1.5 w-full", 
                  interview.status === InterviewStatus.PENDING ? "bg-yellow-400" :
                  interview.status === InterviewStatus.CONFIRMED ? "bg-green-500" : "bg-red-500"
                )} />
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <Badge className={cn("font-black text-[9px] px-3 py-1 ring-1 border-none uppercase tracking-widest gap-1.5", statusInfo.color)}>
                      <StatusIcon size={10} /> {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {interview.application.job.company?.logoUrl ? (
                          <img src={interview.application.job.company.logoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={24} className="text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-[#00b14f] uppercase tracking-widest mb-0.5 italic">
                          {interview.application.job.company?.name}
                        </p>
                        <p className="font-black text-slate-800 uppercase text-sm truncate leading-tight">
                          {interview.application.job.title}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                          <CalendarCheck2 size={16} className="text-[#00b14f]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</span>
                          <span className="text-xs font-black text-slate-700 uppercase italic">
                            {format(new Date(interview.interviewDate), 'eeee, dd/MM/yyyy - HH:mm', { locale: vi })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100 shrink-0">
                          <MapPin size={16} className="text-[#00b14f]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa điểm</span>
                          <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
                            {interview.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {interview.status === InterviewStatus.PENDING && (
                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-slate-200">
                      <Button 
                        variant="outline"
                        className="rounded-xl font-black text-[10px] uppercase tracking-widest border-red-100 text-red-500 hover:bg-red-50 gap-2 h-10"
                        onClick={() => handleUpdateStatus(interview.id, InterviewStatus.DECLINED)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <X size={14} /> Từ chối
                      </Button>
                      <Button 
                        className="rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#00b14f] hover:bg-[#009643] gap-2 h-10"
                        onClick={() => handleUpdateStatus(interview.id, InterviewStatus.CONFIRMED)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Check size={14} /> Xác nhận
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

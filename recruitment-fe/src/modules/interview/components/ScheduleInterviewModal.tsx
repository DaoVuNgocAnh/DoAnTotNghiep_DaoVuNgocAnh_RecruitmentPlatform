import { useState } from 'react';
import { useCreateInterview } from '../api/interview.api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Loader2, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleInterviewModalProps {
  applicationId: string;
  candidateName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleInterviewModal = ({
  applicationId,
  candidateName,
  isOpen,
  onClose,
}: ScheduleInterviewModalProps) => {
  const [interviewDate, setInterviewDate] = useState('');
  const [location, setLocation] = useState('');
  const createMutation = useCreateInterview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewDate || !location) {
      return toast.error('Vui lòng điền đầy đủ thông tin');
    }

    createMutation.mutate(
      { applicationId, interviewDate, location },
      {
        onSuccess: () => {
          toast.success('Đã gửi lời mời phỏng vấn tới ứng viên');
          onClose();
        },
        onError: () => toast.error('Thao tác thất bại'),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl max-w-md border-2 border-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase text-[#00b14f] flex items-center gap-2">
            <CalendarPlus size={24} /> Hẹn phỏng vấn
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Ứng viên</p>
            <p className="font-black text-slate-800 uppercase text-sm">{candidateName}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1.5">
                <Calendar size={12} className="text-[#00b14f]" /> Thời gian phỏng vấn
              </Label>
              <Input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="rounded-xl h-12 font-bold text-slate-700 focus-visible:ring-[#00b14f]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1.5">
                <MapPin size={12} className="text-[#00b14f]" /> Địa điểm
              </Label>
              <Input
                placeholder="Văn phòng công ty, Link Google Meet, ..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl h-12 font-bold text-slate-700 focus-visible:ring-[#00b14f]"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-[#00b14f] hover:bg-[#009643] font-black rounded-2xl h-12 uppercase tracking-widest shadow-lg shadow-green-100"
            >
              {createMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <CalendarPlus className="mr-2" size={18} />
              )}
              XÁC NHẬN HẸN PHỎNG VẤN
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

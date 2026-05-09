import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquareText, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  feedbackApi,
  type FeedbackType,
} from '@/modules/feedback/api/feedback.api';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const feedbackTypes: Array<{ label: string; value: FeedbackType }> = [
  { label: 'Báo lỗi', value: 'BUG' },
  { label: 'Đề xuất', value: 'SUGGESTION' },
  { label: 'Câu hỏi', value: 'QUESTION' },
  { label: 'Khác', value: 'OTHER' },
];

export const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const queryClient = useQueryClient();
  const [type, setType] = useState<FeedbackType>('SUGGESTION');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const mutation = useMutation({
    mutationFn: feedbackApi.create,
    onSuccess: () => {
      toast.success('Đã gửi góp ý. Cảm ơn bạn đã giúp SmartCV tốt hơn.');
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      setTitle('');
      setContent('');
      setType('SUGGESTION');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể gửi góp ý');
    },
  });

  const handleSubmit = () => {
    if (title.trim().length < 3 || content.trim().length < 10) {
      toast.error('Vui lòng nhập tiêu đề và nội dung góp ý rõ hơn');
      return;
    }

    mutation.mutate({
      type,
      title: title.trim(),
      content: content.trim(),
      pageUrl: window.location.pathname,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-slate-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-black uppercase">
            <MessageSquareText className="text-primary" size={20} />
            Góp ý cho SmartCV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {feedbackTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setType(item.value)}
                className={`rounded-2xl border px-3 py-2 text-xs font-black transition-all ${
                  type === item.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Tiêu đề góp ý"
            className="h-12 rounded-2xl bg-slate-50 font-bold"
            maxLength={150}
          />

          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Mô tả vấn đề hoặc đề xuất của bạn..."
            className="min-h-40 rounded-2xl bg-slate-50 font-medium"
            maxLength={3000}
          />

          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="h-12 w-full rounded-2xl font-black uppercase"
          >
            <Send size={17} />
            Gửi góp ý
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

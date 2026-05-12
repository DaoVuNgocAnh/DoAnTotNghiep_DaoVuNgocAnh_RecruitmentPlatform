import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CheckCircle2, Inbox, Loader2, MessageSquareText } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  feedbackApi,
  type FeedbackStatus,
  type FeedbackType,
} from '@/modules/feedback/api/feedback.api';
import { Pagination } from '@/components/shared/Pagination';

const statusLabels: Record<FeedbackStatus, string> = {
  NEW: 'Mới',
  REVIEWING: 'Đang xử lý',
  RESOLVED: 'Đã xử lý',
};

const typeLabels: Record<FeedbackType, string> = {
  BUG: 'Báo lỗi',
  SUGGESTION: 'Đề xuất',
  QUESTION: 'Câu hỏi',
  OTHER: 'Khác',
};

export const AdminFeedbackPage = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<FeedbackStatus | 'ALL'>('ALL');
  const [type, setType] = useState<FeedbackType | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: feedbacksData, isLoading } = useQuery({
    queryKey: ['admin-feedback', status, type, page],
    queryFn: () => feedbackApi.getAll({ status, type, page, limit }).then((res) => res.data),
  });

  const feedbacks = feedbacksData?.data || [];

  const mutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: FeedbackStatus }) =>
      feedbackApi.updateStatus(id, nextStatus),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái góp ý');
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật góp ý');
    },
  });

  const stats = useMemo(
    () => ({
      total: feedbacksData?.meta?.total || 0,
      new: feedbacks?.filter((item) => item.status === 'NEW').length || 0, // This only filters current page, but stats in header should ideally be global. For now using what's available.
      resolved:
        feedbacks?.filter((item) => item.status === 'RESOLVED').length || 0,
    }),
    [feedbacks, feedbacksData],
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
            Góp ý người dùng
          </h1>
          <p className="text-sm font-medium italic text-zinc-500">
            Theo dõi phản hồi, lỗi và đề xuất từ ứng viên hoặc nhà tuyển dụng.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ['Tổng', stats.total],
            ['Mới', stats.new], // Lưu ý: Hiện tại meta chỉ trả về tổng total, không trả về count theo status
            ['Xong', stats.resolved],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-center shadow-sm"
            >
              <p className="text-[10px] font-black uppercase text-zinc-400">
                {label}
              </p>
              <p className="text-xl font-black text-zinc-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="rounded-3xl border-zinc-100 shadow-sm">
        <CardHeader className="border-b border-zinc-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-black uppercase">
              <MessageSquareText className="text-blue-600" size={18} />
              Danh sách góp ý
            </CardTitle>
            <div className="flex gap-3">
              <Select value={status} onValueChange={(value) => { setStatus(value as FeedbackStatus | 'ALL'); setPage(1); }}>
                <SelectTrigger className="w-36 rounded-xl">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="NEW">Mới</SelectItem>
                  <SelectItem value="REVIEWING">Đang xử lý</SelectItem>
                  <SelectItem value="RESOLVED">Đã xử lý</SelectItem>
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={(value) => { setType(value as FeedbackType | 'ALL'); setPage(1); }}>
                <SelectTrigger className="w-36 rounded-xl">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="BUG">Báo lỗi</SelectItem>
                  <SelectItem value="SUGGESTION">Đề xuất</SelectItem>
                  <SelectItem value="QUESTION">Câu hỏi</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={34} />
            </div>
          ) : feedbacks?.length ? (
            <>
              <div className="divide-y divide-zinc-100">
                {feedbacks.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge className="border-none bg-blue-50 text-blue-600 hover:bg-blue-50">
                            {typeLabels[item.type]}
                          </Badge>
                          <Badge
                            className={`border-none ${
                              item.status === 'RESOLVED'
                                ? 'bg-green-50 text-green-600 hover:bg-green-50'
                                : item.status === 'REVIEWING'
                                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-50'
                                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-100'
                            }`}
                          >
                            {statusLabels[item.status]}
                          </Badge>
                          <span className="text-xs font-bold text-zinc-400">
                            {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-zinc-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-zinc-600">
                          {item.content}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold text-zinc-400">
                          <span>
                            Người gửi:{' '}
                            {item.user
                              ? `${item.user.fullName} (${item.user.email})`
                              : 'Ẩn danh'}
                          </span>
                          {item.pageUrl && <span>Trang: {item.pageUrl}</span>}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        {item.status !== 'REVIEWING' && (
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() =>
                              mutation.mutate({
                                id: item.id,
                                nextStatus: 'REVIEWING',
                              })
                            }
                          >
                            Đang xử lý
                          </Button>
                        )}
                        {item.status !== 'RESOLVED' && (
                          <Button
                            className="rounded-xl bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              mutation.mutate({
                                id: item.id,
                                nextStatus: 'RESOLVED',
                              })
                            }
                          >
                            <CheckCircle2 size={16} />
                            Xong
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {feedbacksData?.meta?.totalPages && (
                <div className="p-6 border-t border-zinc-100">
                  <Pagination 
                    currentPage={page}
                    totalPages={feedbacksData.meta.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-zinc-400">
              <Inbox className="mx-auto mb-3 opacity-30" size={46} />
              <p className="text-sm font-bold">Chưa có góp ý phù hợp.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Info,
  Loader2,
  Plus,
  PowerOff,
  UserPlus,
  X,
  Flame,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useUser } from '@/modules/user/hooks/useUser';
import { companyApi } from '../api/company.api';
import { jobApi, useMyJobs, useTrendingJobs } from '../../job/api/job.api';

export const EmployerManageJobs = () => {
  const { data: jobs, isLoading } = useMyJobs();
  const { data: trendingJobs } = useTrendingJobs();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const trendingIds = new Set(trendingJobs?.map((j) => j.id) || []);

  const { data: members = [] } = useQuery({
    queryKey: ['company-members'],
    queryFn: () => companyApi.getMembers().then((res) => res.data),
    enabled: !!user?.isOwner,
  });

  const refreshJobs = () =>
    queryClient.invalidateQueries({ queryKey: ['my-jobs'] });

  const handleClose = async (id: string) => {
    try {
      await jobApi.closeJob(id);
      toast.success('Đã đóng tin tuyển dụng');
      refreshJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể đóng tin');
    }
  };

  const handleAssign = async (jobId: string, memberId: string) => {
    try {
      await companyApi.assignMemberToJob(jobId, memberId);
      toast.success('Đã phân công thành viên');
      refreshJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể phân công');
    }
  };

  const handleUnassign = async (jobId: string, memberId: string) => {
    try {
      await companyApi.unassignMemberFromJob(jobId, memberId);
      toast.success('Đã gỡ phân công');
      refreshJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể gỡ phân công');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      ACTIVE: 'bg-green-100 text-green-700 ring-green-600/20',
      PENDING: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
      CLOSED: 'bg-slate-100 text-slate-500 ring-slate-400/20',
      REJECTED: 'bg-red-100 text-red-700 ring-red-600/20',
    };

    return (
      <Badge
        className={cn(
          'border-none ring-1 px-3 font-bold',
          styles[status] || styles.CLOSED
        )}
      >
        {status}
      </Badge>
    );
  };

  const getAvailableMembers = (job: any) => {
    const assignedIds = new Set(
      job.assignees?.map((item: any) => item.userId) || []
    );
    return members.filter((member: any) => !assignedIds.has(member.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight border-l-4 border-[#00b14f] pl-4">
              Kho tin tuyển dụng
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium ml-4 italic">
            Quản lý hiệu quả tuyển dụng và phân quyền nhân sự.
          </p>
        </div>
        <Button
          onClick={() => navigate('/employer/jobs/create')}
          className="bg-[#00b14f] hover:bg-[#009643] rounded-2xl gap-2 font-black shadow-lg shadow-green-100"
        >
          <Plus size={20} /> Đăng tin mới
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-black text-slate-800 px-8 py-5">
                Vị trí tuyển dụng
              </TableHead>
              <TableHead className="font-black text-slate-800 text-center">
                Hiệu quả
              </TableHead>
              <TableHead className="font-black text-slate-800 text-center">
                Trạng thái
              </TableHead>
              <TableHead className="font-black text-slate-800 text-center">
                Hạn nộp
              </TableHead>
              <TableHead className="font-black text-slate-800">
                Phụ trách
              </TableHead>
              <TableHead className="font-black text-slate-800 text-right px-8">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-[#00b14f]"
                    size={32}
                  />
                </TableCell>
              </TableRow>
            ) : jobs?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-20 text-slate-400"
                >
                  <Info className="mx-auto mb-2 opacity-20" size={48} />
                  Bạn chưa có tin tuyển dụng nào.
                </TableCell>
              </TableRow>
            ) : (
              jobs?.map((job: any) => {
                const availableMembers = getAvailableMembers(job);
                const isTrending = trendingIds.has(job.id);

                return (
                  <TableRow
                    key={job.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="px-8 py-5">
                      <p className="font-bold text-slate-900 leading-tight mb-1">
                        {job.title}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
                        <span>{job.category?.name}</span>
                        <span>Lương: {job.salary}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {job.viewCount} lượt xem
                        </span>
                        {isTrending && (
                          <Badge className="bg-rose-50 text-rose-600 border-rose-100 text-[9px] font-black uppercase py-0.5 px-2 rounded-full animate-pulse">
                            <Flame size={10} className="mr-1 fill-current" />{' '}
                            Đang hot
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-500 text-xs">
                      <div className="flex items-center justify-center gap-2 bg-slate-100 py-1 rounded-lg w-fit mx-auto px-2">
                        <Calendar size={14} className="text-[#00b14f]" />
                        {job.expiredDate
                          ? new Date(job.expiredDate).toLocaleDateString(
                              'vi-VN'
                            )
                          : 'Vô thời hạn'}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 min-w-[260px]">
                      <div className="flex flex-wrap gap-2">
                        {job.assignees?.length ? (
                          job.assignees.map((assignee: any) => (
                            <Badge
                              key={assignee.userId}
                              variant="secondary"
                              className="rounded-xl bg-slate-100 text-slate-600 gap-1"
                            >
                              {assignee.user?.fullName || assignee.user?.email}
                              {user?.isOwner && (
                                <button
                                  type="button"
                                  className="ml-1 text-slate-400 hover:text-red-500"
                                  onClick={() =>
                                    handleUnassign(job.id, assignee.userId)
                                  }
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">
                            Chưa phân công
                          </span>
                        )}
                      </div>

                      {user?.isOwner && (
                        <div className="mt-3 flex items-center gap-2">
                          <Select
                            key={`${job.id}-${job.assignees?.length || 0}`}
                            onValueChange={(memberId) =>
                              handleAssign(job.id, memberId)
                            }
                            disabled={availableMembers.length === 0}
                          >
                            <SelectTrigger className="h-8 w-[190px] rounded-xl text-xs">
                              <SelectValue placeholder="Thêm phụ trách" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMembers.map((member: any) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.fullName || member.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <UserPlus size={16} className="text-slate-300" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right px-8">
                      {job.status === 'ACTIVE' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 gap-2 font-bold rounded-xl"
                          onClick={() => handleClose(job.id)}
                        >
                          <PowerOff size={16} /> Đóng tin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

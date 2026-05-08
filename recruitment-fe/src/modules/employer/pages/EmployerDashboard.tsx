import { Link } from 'react-router-dom';
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  type LucideIcon,
  Plus,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployerApplications } from '@/modules/application/api/application.api';
import { useEmployerInterviews } from '@/modules/interview/api/interview.api';
import { useMyJobs } from '@/modules/job/api/job.api';
import { useUser } from '@/modules/user/hooks/useUser';

const StatCard = ({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number | string;
  icon: LucideIcon;
  tone: string;
}) => (
  <Card className="rounded-2xl border-slate-100 shadow-sm">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {title}
        </p>
        <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={24} />
      </div>
    </CardContent>
  </Card>
);

export const EmployerDashboard = () => {
  const { data: user } = useUser();
  const { data: jobs = [], isLoading: jobsLoading } = useMyJobs();
  const { data: applications = [], isLoading: appsLoading } = useEmployerApplications();
  const { data: interviews = [], isLoading: interviewsLoading } = useEmployerInterviews();

  const scopeLabel = user?.isOwner ? 'toàn công ty' : 'phạm vi được phân công';
  const roleLabel = user?.isOwner ? 'OWNER' : 'HR MEMBER';
  const activeJobs = jobs.filter((job: any) => job.status === 'ACTIVE').length;
  const pendingJobs = jobs.filter((job: any) => job.status === 'PENDING').length;
  const pendingApplications = applications.filter((app: any) =>
    ['PENDING', 'REVIEWING'].includes(app.status),
  ).length;
  const upcomingInterviews = interviews.filter(
    (interview) => new Date(interview.interviewDate).getTime() >= Date.now(),
  ).length;

  const recentJobs = [...jobs]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const isLoading = jobsLoading || appsLoading || interviewsLoading;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="border-l-4 border-[#00b14f] pl-4 text-2xl font-black uppercase tracking-tight text-[#001529]">
            Tổng quan tuyển dụng
          </h1>
          <p className="ml-4 mt-1 text-sm font-medium italic text-slate-500">
            Theo dõi hiệu quả tuyển dụng trong {scopeLabel}.
          </p>
        </div>
        <Button asChild className="rounded-2xl bg-[#00b14f] font-black hover:bg-[#009643]">
          <Link to="/employer/jobs/create">
            <Plus className="mr-2" size={18} /> Đăng tin mới
          </Link>
        </Button>
      </div>

      <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b14f]">
              Xin chào
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              {user?.fullName || 'Nhà tuyển dụng'}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Trạng thái công ty: {user?.companyStatus || 'N/A'} · Dữ liệu theo {scopeLabel}
            </p>
          </div>
          <Badge className="w-fit rounded-xl border-none bg-green-50 px-4 py-2 font-black text-[#00b14f] hover:bg-green-50">
            {roleLabel}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title={`Tin tuyển dụng (${scopeLabel})`} value={jobs.length} icon={Briefcase} tone="bg-green-50 text-[#00b14f]" />
        <StatCard title="Tin đang hoạt động" value={activeJobs} icon={CheckCircle2} tone="bg-blue-50 text-blue-600" />
        <StatCard title="Ứng viên cần xử lý" value={pendingApplications} icon={Users} tone="bg-yellow-50 text-yellow-600" />
        <StatCard title="Lịch sắp tới" value={upcomingInterviews} icon={CalendarClock} tone="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="rounded-3xl border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-black uppercase text-slate-800">
              Tin tuyển dụng gần đây
            </CardTitle>
            <Button asChild variant="ghost" className="font-bold text-[#00b14f]">
              <Link to="/employer/jobs">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-sm font-bold text-slate-400">Đang tải dữ liệu...</div>
            ) : recentJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm font-bold text-slate-400">
                Chưa có tin tuyển dụng nào trong {scopeLabel}.
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-800">{job.title}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {job.category?.name || 'Chưa phân loại'} · {job.salary}
                      </p>
                    </div>
                    <Badge className="ml-4 border-none bg-slate-100 font-black text-slate-600 hover:bg-slate-100">
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase text-slate-800">
              Việc cần chú ý
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-4 text-yellow-700">
              <Clock size={20} />
              <div>
                <p className="font-black">{pendingJobs} tin đang chờ duyệt</p>
                <p className="text-xs font-medium">Theo dõi trạng thái duyệt từ admin.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-blue-700">
              <FileText size={20} />
              <div>
                <p className="font-black">{applications.length} hồ sơ ứng tuyển</p>
                <p className="text-xs font-medium">Đánh giá và hẹn phỏng vấn ứng viên phù hợp.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

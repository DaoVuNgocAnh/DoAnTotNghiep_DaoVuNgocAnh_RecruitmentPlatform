import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Briefcase, Clock, type LucideIcon, ShieldCheck, Users } from 'lucide-react';
import { adminApi } from '../api/admin.api';
import { useAdminJobs } from '@/modules/job/api/job.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StatCard = ({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  className: string;
}) => (
  <Card className="rounded-3xl border-none shadow-sm">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          {title}
        </p>
        <p className="mt-2 text-3xl font-black text-zinc-900">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${className}`}>
        <Icon size={24} />
      </div>
    </CardContent>
  </Card>
);

export const AdminDashboard = () => {
  const { data: companies = [] } = useQuery({
    queryKey: ['admin-companies-dashboard'],
    queryFn: () => adminApi.getCompanies().then((res) => res.data),
  });
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((res) => res.data),
  });
  const { data: pendingJobs = [] } = useAdminJobs('PENDING');
  const { data: activeJobs = [] } = useAdminJobs('ACTIVE');

  const companyStats = useMemo(
    () => ({
      pending: companies.filter((company: any) => company.status === 'PENDING').length,
      verified: companies.filter((company: any) => company.status === 'VERIFIED').length,
      rejected: companies.filter((company: any) => company.status === 'REJECTED').length,
      blacklisted: companies.filter((company: any) => company.status === 'BLACKLISH').length,
    }),
    [companies],
  );

  const userStats = useMemo(
    () => ({
      admin: users.filter((user) => user.role === 'ADMIN').length,
      employer: users.filter((user) => user.role === 'EMPLOYER').length,
      candidate: users.filter((user) => user.role === 'CANDIDATE').length,
      locked: users.filter((user) => user.status === 'LOCKED').length,
    }),
    [users],
  );

  const newestCompanies = [...companies]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
          Bảng điều khiển hệ thống
        </h1>
        <p className="mt-1 text-sm font-medium italic text-zinc-500">
          Tổng hợp nhanh tình trạng doanh nghiệp, tin tuyển dụng và người dùng.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Doanh nghiệp" value={companies.length} icon={Building2} className="bg-blue-50 text-blue-600" />
        <StatCard title="Chờ duyệt công ty" value={companyStats.pending} icon={Clock} className="bg-yellow-50 text-yellow-600" />
        <StatCard title="Tin chờ duyệt" value={pendingJobs.length} icon={Briefcase} className="bg-purple-50 text-purple-600" />
        <StatCard title="Người dùng" value={users.length} icon={Users} className="bg-green-50 text-green-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase text-zinc-800">
              Trạng thái doanh nghiệp
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {([
              ['VERIFIED', companyStats.verified, 'bg-green-50 text-green-600'],
              ['PENDING', companyStats.pending, 'bg-yellow-50 text-yellow-600'],
              ['REJECTED', companyStats.rejected, 'bg-red-50 text-red-600'],
              ['BLACKLIST', companyStats.blacklisted, 'bg-zinc-100 text-zinc-700'],
            ] as Array<[string, number, string]>).map(([label, value, tone]) => (
              <div key={label} className="rounded-2xl bg-zinc-50 p-4">
                <Badge className={`border-none font-black ${tone}`}>{label}</Badge>
                <p className="mt-3 text-2xl font-black text-zinc-900">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase text-zinc-800">
              Cơ cấu người dùng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {([
              ['Admin', userStats.admin],
              ['Employer', userStats.employer],
              ['Candidate', userStats.candidate],
              ['Locked', userStats.locked],
            ] as Array<[string, number]>).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4">
                <span className="text-sm font-black uppercase text-zinc-600">{label}</span>
                <span className="text-xl font-black text-zinc-900">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase text-zinc-800">
              Doanh nghiệp mới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {newestCompanies.length === 0 ? (
              <div className="py-8 text-center text-sm font-bold text-zinc-400">
                Chưa có dữ liệu doanh nghiệp.
              </div>
            ) : (
              newestCompanies.map((company: any) => (
                <div key={company.id} className="flex items-center justify-between rounded-2xl border border-zinc-100 p-4">
                  <div>
                    <p className="font-black text-zinc-900">{company.name}</p>
                    <p className="mt-1 text-xs font-bold text-zinc-400">MST: {company.taxCode}</p>
                  </div>
                  <Badge className="border-none bg-zinc-100 font-black text-zinc-600 hover:bg-zinc-100">
                    {company.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase text-zinc-800">
              Tình trạng tin tuyển dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-4 text-yellow-700">
              <Clock size={20} />
              <div>
                <p className="font-black">{pendingJobs.length} tin chờ duyệt</p>
                <p className="text-xs font-medium">Cần kiểm tra nội dung và trạng thái công ty.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700">
              <ShieldCheck size={20} />
              <div>
                <p className="font-black">{activeJobs.length} tin đang hoạt động</p>
                <p className="text-xs font-medium">Đang hiển thị công khai trên trang tuyển dụng.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats().then((res) => res.data),
  });

  const { data: companiesData } = useQuery({
    queryKey: ['admin-companies-recent'],
    queryFn: () => adminApi.getCompanies({ page: 1, limit: 5 }).then((res) => res.data),
  });

  useAdminJobs({ status: 'PENDING', limit: 1 });
  useAdminJobs({ status: 'ACTIVE', limit: 1 });

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center text-zinc-400 font-bold uppercase text-xs tracking-widest">Đang tải thống kê...</div>;

  const companies = stats?.companies || { total: 0, byStatus: {} };
  const users = stats?.users || { total: 0, byRole: {}, byStatus: {} };
  const jobs = stats?.jobs || { total: 0, byStatus: {} };
  const recentCompanies = companiesData?.data || [];

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
        <StatCard title="Doanh nghiệp" value={companies.total} icon={Building2} className="bg-blue-50 text-blue-600" />
        <StatCard title="Chờ duyệt công ty" value={companies.byStatus['PENDING'] || 0} icon={Clock} className="bg-yellow-50 text-yellow-600" />
        <StatCard title="Tin chờ duyệt" value={jobs.byStatus['PENDING'] || 0} icon={Briefcase} className="bg-purple-50 text-purple-600" />
        <StatCard title="Người dùng" value={users.total} icon={Users} className="bg-green-50 text-green-600" />
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
              ['VERIFIED', companies.byStatus['VERIFIED'] || 0, 'bg-green-50 text-green-600'],
              ['PENDING', companies.byStatus['PENDING'] || 0, 'bg-yellow-50 text-yellow-600'],
              ['REJECTED', companies.byStatus['REJECTED'] || 0, 'bg-red-50 text-red-600'],
              ['BLACKLIST', companies.byStatus['BLACKLIST'] || 0, 'bg-zinc-100 text-zinc-700'],
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
              ['Admin', users.byRole['ADMIN'] || 0],
              ['Employer', users.byRole['EMPLOYER'] || 0],
              ['Candidate', users.byRole['CANDIDATE'] || 0],
              ['Locked', users.byStatus['LOCKED'] || 0],
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
            {recentCompanies.length === 0 ? (
              <div className="py-8 text-center text-sm font-bold text-zinc-400">
                Chưa có dữ liệu doanh nghiệp.
              </div>
            ) : (
              recentCompanies.map((company: any) => (
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
                <p className="font-black">{jobs.byStatus['PENDING'] || 0} tin chờ duyệt</p>
                <p className="text-xs font-medium">Cần kiểm tra nội dung và trạng thái công ty.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700">
              <ShieldCheck size={20} />
              <div>
                <p className="font-black">{jobs.byStatus['ACTIVE'] || 0} tin đang hoạt động</p>
                <p className="text-xs font-medium">Đang hiển thị công khai trên trang tuyển dụng.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

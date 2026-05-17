import { useCompanyAnalytics } from "../api/company.api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  REVIEWING: 'Đang xem xét',
  INTERVIEW: 'Phỏng vấn',
  ACCEPTED: 'Đã nhận',
  REJECTED: 'Từ chối',
  WITHDRAWN: 'Rút hồ sơ'
};

export const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useCompanyAnalytics();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="font-bold text-slate-400">Đang tổng hợp dữ liệu chiến dịch...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4 text-center">
        <AlertCircle className="text-red-500" size={48} />
        <h3 className="text-xl font-bold">Không thể tải dữ liệu</h3>
        <p className="text-slate-500">Đã có lỗi xảy ra khi truy xuất thông tin thống kê.</p>
      </div>
    );
  }

  const funnelData = Object.entries(data.funnel).map(([status, count]) => ({
    name: STATUS_MAP[status] || status,
    value: Number(count)
  }));

  const jobData = Object.entries(data.jobs).map(([status, count]) => ({
    name: status,
    value: Number(count)
  }));

  const totalApps = funnelData.reduce((acc, curr) => acc + curr.value, 0);
  const totalJobs = jobData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Hiring Analytics</h1>
        <p className="text-slate-500 font-medium">Báo cáo hiệu quả tuyển dụng của doanh nghiệp</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-none shadow-sm bg-indigo-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Tổng tin tuyển dụng</p>
                <h3 className="text-4xl font-black text-indigo-900 mt-1">{totalJobs}</h3>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Briefcase size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Tổng hồ sơ ứng tuyển</p>
                <h3 className="text-4xl font-black text-emerald-900 mt-1">{totalApps}</h3>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                <Users size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">Tỉ lệ chuyển đổi</p>
                <h3 className="text-4xl font-black text-amber-900 mt-1">
                  {totalApps > 0 ? ((data.funnel.ACCEPTED || 0) / totalApps * 100).toFixed(1) : 0}%
                </h3>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                <TrendingUp size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Chart */}
        <Card className="rounded-[2rem] border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="font-black uppercase text-lg">Phễu tuyển dụng</CardTitle>
            <CardDescription>Phân bổ trạng thái của ứng viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    style={{ fontSize: '12px', fontWeight: 'bold' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="rounded-[2rem] border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="font-black uppercase text-lg">Xu hướng ứng tuyển</CardTitle>
            <CardDescription>Lượng hồ sơ mới trong 6 tháng qua</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    style={{ fontSize: '12px', fontWeight: 'bold' }} 
                  />
                  <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Job Status Pie */}
        <Card className="rounded-[2rem] border-slate-100 shadow-sm lg:col-span-2">
           <CardHeader>
            <CardTitle className="font-black uppercase text-lg">Tình trạng tin tuyển dụng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center">
            <div className="h-[300px] flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobData}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {jobData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4 w-full px-8">
               {jobData.map((item, index) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                       <span className="text-sm font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-black">{item.value} tin</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

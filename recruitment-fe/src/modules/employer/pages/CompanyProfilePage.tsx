import { useQuery } from '@tanstack/react-query';
import { Building2, Globe, Loader2, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { companyApi } from '@/modules/company/api/company.api';
import { useUser } from '@/modules/user/hooks/useUser';

export const CompanyProfilePage = () => {
  const { data: user } = useUser();
  const companyId = user?.companyId;

  const { data: company, isLoading } = useQuery({
    queryKey: ['employer-company-profile', companyId],
    queryFn: () => companyApi.getCompanyById(companyId!).then((res) => res.data),
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#00b14f]" size={40} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center text-sm font-bold text-slate-400">
        Không tìm thấy hồ sơ doanh nghiệp.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 rounded-3xl border-4 border-white shadow-md ring-1 ring-slate-100">
              <AvatarImage src={company.logoUrl || undefined} className="object-cover" />
              <AvatarFallback className="rounded-3xl bg-green-50 text-2xl font-black text-[#00b14f]">
                {company.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b14f]">
                Hồ sơ doanh nghiệp
              </p>
              <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#001529]">
                {company.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="border-none bg-green-50 px-3 font-black text-[#00b14f] hover:bg-green-50">
                  <ShieldCheck size={12} className="mr-1" /> {company.status}
                </Badge>
                {user?.isOwner && (
                  <Badge className="border-none bg-blue-50 px-3 font-black text-blue-600 hover:bg-blue-50">
                    OWNER
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Việc đang mở</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{company.jobs?.length || 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vai trò</p>
              <p className="mt-1 text-sm font-black text-slate-900">{user?.isOwner ? 'Chủ sở hữu' : 'Thành viên HR'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <Card className="rounded-3xl border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase text-slate-800">
              Giới thiệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-600">
              {company.description || 'Doanh nghiệp chưa cập nhật mô tả.'}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase text-slate-800">
              Thông tin nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <Globe className="text-[#00b14f]" size={20} />
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase text-slate-400">Website</p>
                <p className="truncate text-sm font-bold text-slate-700">{company.websiteUrl || 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <Building2 className="text-[#00b14f]" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Mã số thuế</p>
                <p className="text-sm font-bold text-slate-700">{company.taxCode || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <Users className="text-[#00b14f]" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Người quản lý</p>
                <p className="text-sm font-bold text-slate-700">{user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <MapPin className="text-[#00b14f]" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Phạm vi tuyển dụng</p>
                <p className="text-sm font-bold text-slate-700">Toàn quốc</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

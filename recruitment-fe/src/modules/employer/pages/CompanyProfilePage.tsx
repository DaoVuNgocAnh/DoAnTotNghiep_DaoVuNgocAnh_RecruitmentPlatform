import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Globe, Loader2, MapPin, Users, Edit, Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { companyApi } from '@/modules/company/api/company.api';
import { useUser } from '@/modules/user/hooks/useUser';

const companySchema = z.object({
  name: z.string().min(1, 'Tên công ty không được để trống'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  websiteUrl: z.string().url('Website không hợp lệ').optional().or(z.literal('')),
  location: z.string().min(1, 'Địa điểm không được để trống'),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export const CompanyProfilePage = () => {
  const { data: user } = useUser();
  const companyId = user?.companyId;
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ['employer-company-profile', companyId],
    queryFn: () => companyApi.getCompanyById(companyId!).then((res) => res.data),
    enabled: !!companyId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: CompanyFormValues) => companyApi.updateMyCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-company-profile', companyId] });
      toast.success('Cập nhật hồ sơ thành công');
      setIsEditing(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'),
  });

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyApi.uploadCompanyLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-company-profile', companyId] });
      toast.success('Cập nhật Logo thành công');
    },
    onError: () => toast.error('Lỗi khi tải lên Logo'),
  });

  const uploadCoverMutation = useMutation({
    mutationFn: (file: File) => companyApi.uploadCompanyCover(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-company-profile', companyId] });
      toast.success('Cập nhật Ảnh bìa thành công');
    },
    onError: () => toast.error('Lỗi khi tải lên Ảnh bìa'),
  });

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    values: {
      name: company?.name || '',
      description: company?.description || '',
      websiteUrl: company?.websiteUrl || '',
      location: company?.location || '',
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ảnh quá lớn (tối đa 2MB)');
        return;
      }
      uploadLogoMutation.mutate(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Ảnh quá lớn (tối đa 3MB)');
        return;
      }
      uploadCoverMutation.mutate(file);
    }
  };

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Premium Cover Photo Section */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 h-64 md:h-80 shadow-xl">
          <img 
            src={company.coverUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"} 
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            alt="Company Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          
          {user?.isOwner && (
            <div className="absolute top-6 right-6">
               <Button 
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadCoverMutation.isPending}
                className="rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 font-black uppercase tracking-widest text-[10px] h-10 px-6"
               >
                 {uploadCoverMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Camera className="mr-2" size={16} />} 
                 Thay đổi ảnh bìa
               </Button>
               <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
            </div>
          )}

          <div className="absolute bottom-8 left-10 right-10 flex flex-col md:flex-row items-end gap-6">
              <div className="group/logo relative shrink-0">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] border-[6px] border-white/10 shadow-2xl bg-white/10 backdrop-blur-xl">
                  <AvatarImage src={company.logoUrl || undefined} className="object-contain p-4" />
                  <AvatarFallback className="rounded-[2rem] bg-white text-3xl font-black text-[#00b14f]">
                    {company.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {user?.isOwner && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadLogoMutation.isPending}
                    className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-black/40 opacity-0 transition-opacity group-hover/logo:opacity-100 backdrop-blur-[2px]"
                  >
                    {uploadLogoMutation.isPending ? (
                      <Loader2 className="animate-spin text-white" />
                    ) : (
                      <Camera className="text-white" size={28} />
                    )}
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="flex-1 pb-2">
                 <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-[#00b14f] text-white border-none px-3 py-1 font-black text-[9px] uppercase rounded-full">
                       Verified Business
                    </Badge>
                    {company.isPremium && (
                      <Badge className="bg-amber-400 text-amber-900 border-none px-3 py-1 font-black text-[9px] uppercase rounded-full">
                         Premium Partner
                      </Badge>
                    )}
                 </div>
                 <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none mb-3">
                    {company.name}
                 </h1>
                 <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                    <MapPin size={12} className="text-[#00b14f]" /> {company.location || "Chưa cập nhật địa điểm"}
                 </p>
              </div>

              <div className="flex gap-3 pb-2">
                 {!isEditing && user?.isOwner && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="rounded-2xl bg-[#00b14f] hover:bg-[#009643] font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-green-900/40"
                    >
                      <Edit size={14} className="mr-2" /> Chỉnh sửa hồ sơ
                    </Button>
                 )}
              </div>
          </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.4fr]">
          <div className="space-y-8">
            {isEditing ? (
               <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                     <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">Cập nhật thông tin chi tiết</CardTitle>
                     <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl font-black text-[10px] uppercase">Hủy</Button>
                        <Button onClick={form.handleSubmit(onSubmit)} className="rounded-xl bg-[#00b14f] hover:bg-[#009643] font-black text-[10px] uppercase h-10 px-6">Lưu hồ sơ</Button>
                     </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên công ty</label>
                           <Input {...form.register('name')} className="h-12 rounded-xl border-slate-100 font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website</label>
                           <Input {...form.register('websiteUrl')} className="h-12 rounded-xl border-slate-100 font-bold" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ trụ sở</label>
                           <Input {...form.register('location')} placeholder="Ví dụ: Tòa nhà Keangnam, Mễ Trì, Nam Từ Liêm, Hà Nội" className="h-12 rounded-xl border-slate-100 font-bold" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Giới thiệu doanh nghiệp</label>
                        <Textarea {...form.register('description')} rows={12} className="rounded-2xl border-slate-100 font-medium leading-relaxed" />
                     </div>
                  </CardContent>
               </Card>
            ) : (
               <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100">
                     <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">Về chúng tôi</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10">
                     <p className="whitespace-pre-wrap text-slate-600 font-medium leading-8 text-base">
                        {company.description || "Doanh nghiệp chưa cập nhật mô tả."}
                     </p>
                  </CardContent>
               </Card>
            )}
          </div>

          <div className="space-y-6">
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                 <CardHeader className="bg-slate-50/50 px-8 py-5 border-b border-slate-100">
                    <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-800">Thông tin nhanh</CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 space-y-6">
                    <div className="space-y-5">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                             <Globe size={18} className="text-[#00b14f]" />
                          </div>
                          <div className="min-w-0">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Website</p>
                             <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="text-sm font-black text-slate-700 hover:text-[#00b14f] truncate block">
                                {company.websiteUrl?.replace(/^https?:\/\//, '') || "N/A"}
                             </a>
                          </div>
                       </div>

                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                             <Building2 size={18} className="text-[#00b14f]" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Mã số thuế</p>
                             <p className="text-sm font-black text-slate-700">{company.taxCode}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                             <MapPin size={18} className="text-[#00b14f]" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Trụ sở</p>
                             <p className="text-sm font-black text-slate-700">{company.location || "N/A"}</p>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <div className="bg-[#001529] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#00b14f]/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-[#00b14f] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-900/20">
                       <Users size={24} />
                    </div>
                    <h4 className="text-xl font-black uppercase mb-2">Tuyển dụng hiệu quả</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Xây dựng thương hiệu nhà tuyển dụng mạnh mẽ để thu hút nhân tài hàng đầu.</p>
                    <Button variant="outline" className="w-full rounded-xl border-slate-700 text-white hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-11 transition-all">
                       Xem trang công khai
                    </Button>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Loader2,
  Edit3,
  Save,
  X,
  Camera,
  Calendar,
  Building2,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useUser } from '@/modules/user/hooks/useUser';
import { userApi } from '@/modules/user/api/user.api';

// UI COMPONENTS
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
  useFlashMessage();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    },
  });

  // Mutation cập nhật thông tin chữ
  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) => userApi.updateProfile(values),
    onSuccess: () => {
      toast.success('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    },
  });

  // Mutation cập nhật Avatar
  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return userApi.updateAvatar(formData);
    },
    onSuccess: () => {
      toast.success('Cập nhật ảnh đại diện thành công!');
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể tải ảnh lên');
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error('Kích thước ảnh không được vượt quá 2MB');
      }
      updateAvatarMutation.mutate(file);
    }
  };

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#00b14f]" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
            Đang tải hồ sơ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: AVATAR & QUICK INFO */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] bg-white text-center">
            <div className="h-32 bg-[#001529] relative"></div>
            <CardContent className="pt-0 pb-10 px-8 relative">
              <div className="flex justify-center">
                <div className="relative -mt-16 group">
                  <Avatar className="h-32 w-32 border-[6px] border-white shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-100">
                    <AvatarImage
                      src={user?.avatarUrl || ''}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl bg-slate-100 text-[#00b14f] font-black uppercase">
                      {user?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Overlay loading khi đang upload */}
                  {updateAvatarMutation.isPending && (
                    <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center z-10">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}

                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={updateAvatarMutation.isPending}
                    className="absolute bottom-0 right-0 p-3 bg-[#00b14f] text-white rounded-2xl shadow-lg border-4 border-white hover:bg-[#009643] transition-all active:scale-90 z-20 group-hover:scale-110"
                  >
                    <Camera size={18} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                  {user?.fullName}
                </h1>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-[#00b14f]/10 text-[#00b14f] border-none px-4 py-1 font-black text-[10px] uppercase tracking-widest rounded-full">
                    {user?.role}
                  </Badge>
                  {user?.companyName && (
                    <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1 font-black text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5">
                      <Building2 size={10} /> {user.companyName}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors cursor-default group">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00b14f]/10 transition-colors">
                    <Mail size={14} className="group-hover:text-[#00b14f]" />
                  </div>
                  <span className="text-xs font-bold truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors cursor-default group">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00b14f]/10 transition-colors">
                    <Calendar size={14} className="group-hover:text-[#00b14f]" />
                  </div>
                  <span className="text-xs font-bold uppercase italic tracking-tighter">
                    Gia nhập: {user?.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi }) : '---'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-[#001529] p-8 rounded-[2.5rem] text-white shadow-xl overflow-hidden relative group">
            <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b14f]">Trạng thái bảo mật</p>
              <h3 className="text-lg font-black uppercase leading-tight">Tài khoản đã được bảo vệ</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
                <div className="w-2 h-2 bg-[#00b14f] rounded-full animate-pulse"></div>
                Đang hoạt động bình thường
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM CHỈNH SỬA */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden h-full">
            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00b14f]/10 flex items-center justify-center text-[#00b14f]">
                    <UserIcon size={24} />
                  </div>
                  Thông tin hồ sơ
                </h2>
                <p className="text-slate-400 text-xs font-medium mt-1 ml-13 italic">Quản lý và cập nhật thông tin cá nhân của bạn.</p>
              </div>
              <Button
                variant={isEditing ? 'ghost' : 'outline'}
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "rounded-2xl font-black text-[10px] uppercase tracking-widest h-10 px-6 transition-all",
                  isEditing ? 'text-slate-400 hover:bg-slate-50' : 'border-[#00b14f] text-[#00b14f] hover:bg-[#00b14f] hover:text-white shadow-sm'
                )}
              >
                {isEditing ? (
                  <>
                    <X size={14} className="mr-2" /> Hủy bỏ
                  </>
                ) : (
                  <>
                    <Edit3 size={14} className="mr-2" /> Chỉnh sửa
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent className="p-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                            Họ và tên đầy đủ
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              placeholder="Nguyễn Văn A"
                              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-[#00b14f] font-black text-slate-700 disabled:opacity-70 disabled:bg-slate-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-tight" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                            <Phone size={12} className="text-[#00b14f]" /> Số điện thoại liên hệ
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: 0912345678"
                              disabled={!isEditing}
                              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-[#00b14f] font-black text-slate-700 disabled:opacity-70 disabled:bg-slate-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-tight" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                          <MapPin size={12} className="text-[#00b14f]" /> Địa chỉ thường trú
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập địa chỉ của bạn (VD: Quận 1, TP. Hồ Chí Minh)"
                            disabled={!isEditing}
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-[#00b14f] font-black text-slate-700 disabled:opacity-70 disabled:bg-slate-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold uppercase tracking-tight" />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <div className="flex justify-end pt-4 animate-in fade-in slide-in-from-bottom-2">
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="bg-[#00b14f] hover:bg-[#009643] h-14 px-12 rounded-[1.25rem] font-black shadow-xl shadow-green-100 transition-all active:scale-95 uppercase tracking-widest"
                      >
                        {updateProfileMutation.isPending ? (
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        ) : (
                          <Save className="mr-3 h-5 w-5" />
                        )}
                        LƯU HỒ SƠ CÁ NHÂN
                      </Button>
                    </div>
                  )}
                </form>
              </Form>

              <Separator className="my-10 opacity-30 border-dashed" />

              <div className="bg-slate-50/80 p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                    Định danh hệ thống (UID)
                  </p>
                  <p className="text-xs text-slate-400 font-mono break-all opacity-60">
                    {user?.id}
                  </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm self-start md:self-auto">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Bảo mật cấp độ 2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

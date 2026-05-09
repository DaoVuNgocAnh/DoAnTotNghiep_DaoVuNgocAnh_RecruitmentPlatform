import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User as UserIcon,
  Mail,
  Shield,
  Loader2,
  Edit3,
  Save,
  X,
  Camera,
  Award,
  CircleCheck,
  Smartphone,
} from 'lucide-react';
import { format } from 'date-fns';

import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useUser } from '@/modules/user/hooks/useUser';
import { userApi } from '@/modules/user/api/user.api';

// UI COMPONENTS
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  bio: z.string().max(1000, 'Giới thiệu tối đa 1000 ký tự').optional().or(z.literal('')),
  skills: z.string().optional().or(z.literal('')),
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
      dateOfBirth: user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '',
      bio: user?.bio ?? '',
      skills: user?.skills ?? '',
    },
  });

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
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
               <div className="h-32 bg-slate-900 relative">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               </div>
               <CardContent className="px-8 pb-10 text-center relative">
                  <div className="flex justify-center -mt-16 mb-6">
                    <div className="relative group">
                       <Avatar className="h-32 w-32 border-4 border-white shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                          <AvatarImage src={user?.avatarUrl || ''} className="object-cover" />
                          <AvatarFallback className="text-3xl bg-slate-50 text-primary font-black uppercase">
                            {user?.fullName?.charAt(0)}
                          </AvatarFallback>
                       </Avatar>
                       {updateAvatarMutation.isPending && (
                         <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                         </div>
                       )}
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-transform z-20"
                       >
                         <Camera size={16} />
                       </button>
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </div>
                  </div>

                  <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{user?.fullName}</h1>
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full mb-8">
                     {user?.role}
                  </Badge>

                  <div className="space-y-4 pt-8 border-t border-slate-50">
                     <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                           <Mail size={14} />
                        </div>
                        <span className="truncate">{user?.email}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                           <Smartphone size={14} />
                        </div>
                        <span>{user?.phone || "Chưa cập nhật SĐT"}</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
               <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Tài khoản xác thực</p>
                  <h3 className="text-lg font-black uppercase leading-tight mb-6">Mức độ hoàn thiện <br /> hồ sơ: 85%</h3>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                     <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(0,177,79,0.5)]"></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic flex items-center gap-2">
                     <CircleCheck size={12} className="text-primary" /> Bạn đã sẵn sàng ứng tuyển
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-8">
            <Card className="border-transparent shadow-sm rounded-3xl bg-white overflow-hidden">
               <CardHeader className="p-8 md:p-10 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <UserIcon size={20} />
                       </div>
                       Chi tiết hồ sơ
                    </h2>
                  </div>
                  <Button
                    variant={isEditing ? 'ghost' : 'outline'}
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                      "rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 transition-all",
                      isEditing ? 'text-slate-400' : 'border-primary text-primary hover:bg-primary hover:text-white'
                    )}
                  >
                    {isEditing ? <><X size={14} className="mr-2" /> Hủy</> : <><Edit3 size={14} className="mr-2" /> Chỉnh sửa</>}
                  </Button>
               </CardHeader>

               <CardContent className="p-8 md:p-10">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Họ tên đầy đủ</FormLabel>
                                <FormControl>
                                  <Input disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Ngày sinh</FormLabel>
                                <FormControl>
                                  <Input type="date" disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Số điện thoại</FormLabel>
                                <FormControl>
                                  <Input disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Địa chỉ</FormLabel>
                                <FormControl>
                                  <Input disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       </div>

                       <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                                <Award size={12} className="text-primary" /> Kỹ năng chuyên môn
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="VD: React, Node.js, UI/UX..." disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                       />

                       <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Giới thiệu bản thân</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Chia sẻ ngắn gọn về bản thân..." disabled={!isEditing} className="min-h-[150px] rounded-2xl border-slate-100 bg-slate-50 font-medium text-slate-600 focus-visible:ring-primary resize-none" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                       />

                       {isEditing && (
                         <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
                            <Button type="submit" disabled={updateProfileMutation.isPending} className="bg-primary hover:bg-primary/90 rounded-xl font-black uppercase tracking-widest text-xs px-12 h-14 shadow-lg shadow-primary/20">
                               {updateProfileMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                               CẬP NHẬT NGAY
                            </Button>
                         </div>
                       )}
                    </form>
                  </Form>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

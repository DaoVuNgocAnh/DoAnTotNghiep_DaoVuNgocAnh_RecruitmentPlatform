import { useState } from 'react';
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
} from 'lucide-react';

import { useFlashMessage } from '@/hooks/useFlashMessage';
// ĐẢM BẢO FILE useUser.ts ĐÃ ĐƯỢC TẠO TRONG THƯ MỤC src/hooks/
import { useUser } from '@/modules/user/hooks/useUser'; // HOOK TRÁI TIM MỚI
import { userApi } from '@/modules/user/api/user.api';

// UI COMPONENTS
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Xóa CardTitle, CardDescription thừa
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Sử dụng toán tử ?? "" để đảm bảo form luôn nhận chuỗi, không nhận null/undefined
    values: {
      fullName: user?.fullName ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
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

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#00b14f]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[2rem] bg-white">
          <CardHeader className="bg-[#001529] h-40 relative">
            <div className="absolute -bottom-12 left-10 flex items-end gap-6 text-white">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl rounded-3xl overflow-hidden bg-white">
                  <AvatarImage
                    src={user?.avatarUrl || ''}
                    className="object-cover text-slate-800"
                  />
                  <AvatarFallback className="text-4xl bg-slate-100 text-[#00b14f] font-black">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-[#00b14f] transition-all opacity-0 group-hover:opacity-100">
                  <Camera size={18} />
                </button>
              </div>
              <div className="mb-4">
                <h1 className="text-3xl font-black tracking-tight uppercase">
                  {user?.fullName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-[#00b14f] text-white border-none px-3 font-bold text-[10px] uppercase tracking-widest">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-20 pb-10 px-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                <UserIcon size={20} className="text-[#00b14f]" /> Thông tin chi
                tiết
              </h2>
              <Button
                variant={isEditing ? 'ghost' : 'outline'}
                onClick={() => setIsEditing(!isEditing)}
                className={
                  isEditing
                    ? 'text-slate-400'
                    : 'border-[#00b14f] text-[#00b14f] rounded-xl font-bold'
                }
              >
                {isEditing ? (
                  <>
                    <X size={18} className="mr-2" /> Hủy
                  </>
                ) : (
                  <>
                    <Edit3 size={18} className="mr-2" /> Chỉnh sửa
                  </>
                )}
              </Button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Mail size={12} /> Địa chỉ Email
                    </label>
                    <div className="h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center text-slate-500 font-medium">
                      {user?.email}
                    </div>
                    {/* ĐÃ FIX: Xóa chữ italic bị lặp ở đây */}
                    <p className="text-[10px] text-slate-400 italic">
                      Email không thể thay đổi
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          Họ và tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={!isEditing}
                            className="h-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-[#00b14f] font-bold"
                            {...field}
                          />
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
                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          <Phone size={12} /> Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0987654321"
                            disabled={!isEditing}
                            className="h-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-[#00b14f] font-bold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Shield size={12} /> Trạng thái tài khoản
                    </label>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-2.5 w-2.5 bg-[#00b14f] rounded-full animate-pulse"></div>
                      <span className="text-sm font-black text-[#00b14f] uppercase tracking-tighter">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <MapPin size={12} /> Địa chỉ thường trú
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Thành phố, Tỉnh"
                          disabled={!isEditing}
                          className="h-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-[#00b14f] font-bold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-[#00b14f] hover:bg-[#009643] h-12 px-10 rounded-2xl font-black shadow-lg shadow-green-100 transition-all active:scale-95"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-5 w-5" />
                      )}
                      LƯU THAY ĐỔI
                    </Button>
                  </div>
                )}
              </form>
            </Form>

            <Separator className="my-10 opacity-50" />

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                ID Tài khoản
              </p>
              <p className="text-xs text-slate-500 font-mono break-all">
                {user?.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

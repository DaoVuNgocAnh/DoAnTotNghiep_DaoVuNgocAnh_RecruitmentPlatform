import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useUser } from '@/modules/user/hooks/useUser';
import { userApi } from '@/modules/user/api/user.api';

export const profileSchema = z.object({
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

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const useProfile = () => {
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

  return {
    user,
    isLoading,
    isEditing,
    setIsEditing,
    fileInputRef,
    form,
    onSubmit,
    handleAvatarChange,
    updateAvatarMutation,
    updateProfileMutation,
  };
};

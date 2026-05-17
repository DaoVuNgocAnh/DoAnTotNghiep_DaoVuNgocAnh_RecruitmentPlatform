import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { companyApi } from '@/modules/company/api/company.api';
import { useUser } from '@/modules/user/hooks/useUser';

export const companySchema = z.object({
  name: z.string().min(1, 'Tên công ty không được để trống'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  websiteUrl: z.string().url('Website không hợp lệ').optional().or(z.literal('')),
  location: z.string().min(1, 'Địa điểm không được để trống'),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export const useCompanyProfile = () => {
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

  return {
    user,
    company,
    isLoading,
    isEditing,
    setIsEditing,
    fileInputRef,
    coverInputRef,
    form,
    onSubmit,
    handleFileChange,
    handleCoverChange,
    uploadLogoMutation,
    uploadCoverMutation,
    updateProfileMutation,
  };
};

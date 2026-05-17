import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../api/company.api';

export const createCompanySchema = z.object({
  name: z.string().min(3, 'Tên công ty ít nhất 3 ký tự'),
  taxCode: z.string().min(10, 'Mã số thuế phải có ít nhất 10 số'),
  description: z.string().min(10, 'Mô tả ít nhất 10 ký tự'),
  websiteUrl: z
    .string()
    .url('Website không hợp lệ')
    .optional()
    .or(z.literal('')),
  logoUrl: z.string().optional(),
});

export type CreateCompanyValues = z.infer<typeof createCompanySchema>;

export const useEmployerSetup = () => {
  const [step, setStep] = useState<'choice' | 'create' | 'join'>('choice');
  const [taxCodeSearch, setTaxCodeSearch] = useState('');
  const [foundCompany, setFoundCompany] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<CreateCompanyValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: { name: '', taxCode: '', description: '', websiteUrl: '' },
  });

  const handleSearch = async () => {
    if (!taxCodeSearch) return toast.error('Vui lòng nhập mã số thuế');
    setIsSearching(true);
    try {
      const res = await companyApi.searchByTaxCode(taxCodeSearch);
      setFoundCompany(res.data);
    } catch (error: any) {
      setFoundCompany(null);
      toast.error(error.response?.data?.message || 'Không tìm thấy công ty');
    } finally {
      setIsSearching(false);
    }
  };

  const joinMutation = useMutation({
    mutationFn: (companyId: string) => companyApi.sendJoinRequest(companyId),
    onSuccess: () => {
      toast.success('Gửi yêu cầu gia nhập thành công!');
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại');
    }
  });

  const createCompanyMutation = useMutation({
    mutationFn: (values: CreateCompanyValues) => companyApi.createCompany(values),
    onSuccess: () => {
      toast.success('Đăng ký hồ sơ công ty thành công!');
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      navigate('/employer', { replace: true });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo công ty thất bại');
    }
  });

  const onCreateSubmit = (values: CreateCompanyValues) => {
    createCompanyMutation.mutate(values);
  };

  const handleJoin = () => {
    if (foundCompany) joinMutation.mutate(foundCompany.id);
  };

  return {
    step,
    setStep,
    taxCodeSearch,
    setTaxCodeSearch,
    foundCompany,
    setFoundCompany,
    isSearching,
    form,
    handleSearch,
    joinMutation,
    createCompanyMutation,
    onCreateSubmit,
    handleJoin,
  };
};

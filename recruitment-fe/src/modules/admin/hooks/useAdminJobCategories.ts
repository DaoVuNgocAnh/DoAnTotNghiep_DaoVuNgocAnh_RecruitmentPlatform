import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobCategoryApi, type JobCategory } from '../api/jobCategoryApi';

export const useAdminJobCategories = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-job-categories', page],
    queryFn: () => jobCategoryApi.getAll({ page, limit }).then((res) => res.data),
  });

  const categories = categoriesData?.data || [];

  const createMutation = useMutation({
    mutationFn: jobCategoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-job-categories'] });
      toast.success('Thêm ngành nghề mới thành công!');
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể thêm ngành nghề');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => jobCategoryApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-job-categories'] });
      toast.success('Cập nhật ngành nghề thành công!');
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật ngành nghề');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: jobCategoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-job-categories'] });
      toast.success('Đã xóa ngành nghề thành công.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể xóa ngành nghề');
    },
    onSettled: () => {
      setIsConfirmDeleteOpen(false);
      setDeletingId(null);
    },
  });

  const openAddDialog = () => {
    setEditingCategory(null);
    setCategoryName('');
    setDescription('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: JobCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setDescription(category.description || '');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Vui lòng nhập tên ngành nghề');
      return;
    }

    const dto = { categoryName, description };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, dto });
    } else {
      createMutation.mutate(dto);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    page,
    setPage,
    isDialogOpen,
    setIsDialogOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    editingCategory,
    deletingId,
    setDeletingId,
    categoryName,
    setCategoryName,
    description,
    setDescription,
    categoriesData,
    isLoading,
    filteredCategories,
    openAddDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    deleteMutation,
    isMutating: createMutation.isPending || updateMutation.isPending,
  };
};

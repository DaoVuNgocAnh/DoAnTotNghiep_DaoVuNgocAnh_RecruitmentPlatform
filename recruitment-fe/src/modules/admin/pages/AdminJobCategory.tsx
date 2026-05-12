import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LayoutGrid, 
  MoreVertical,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { jobCategoryApi, type JobCategory } from '../api/jobCategoryApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/shared/Pagination';

export const AdminJobCategory = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  // 1. Fetch data
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-job-categories', page],
    queryFn: () => jobCategoryApi.getAll({ page, limit }).then((res) => res.data),
  });

  const categories = categoriesData?.data || [];

  // 2. Mutations
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

  // Handlers
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
            Quản lý ngành nghề
          </h1>
          <p className="mt-1 text-sm font-medium italic text-zinc-500">
            Thiết lập danh sách các ngành nghề cho hệ thống tuyển dụng.
          </p>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 gap-2"
        >
          <Plus size={18} />
          Thêm ngành nghề
        </Button>
      </div>

      {/* Stats & Search */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-none shadow-sm md:col-span-1">
          <CardContent className="flex items-center gap-3 p-4">
            <LayoutGrid className="text-blue-600" size={22} />
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-400">Tổng danh mục</p>
              <p className="text-xl font-black text-zinc-900">{categoriesData?.meta?.total || 0}</p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Tìm kiếm ngành nghề..."
            className="pl-10 h-full bg-white border-zinc-200 rounded-2xl font-medium focus-visible:ring-blue-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-100">
              <TableHead className="font-black text-zinc-800 uppercase text-[10px] tracking-widest w-[250px]">
                Tên ngành nghề
              </TableHead>
              <TableHead className="font-black text-zinc-800 uppercase text-[10px] tracking-widest">
                Mô tả
              </TableHead>
              <TableHead className="font-black text-zinc-800 uppercase text-[10px] tracking-widest w-[150px]">
                Ngày tạo
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell><div className="h-4 bg-zinc-100 rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-zinc-100 rounded w-full"></div></TableCell>
                  <TableCell><div className="h-4 bg-zinc-100 rounded w-1/2"></div></TableCell>
                  <TableCell><div className="h-8 w-8 bg-zinc-100 rounded-full"></div></TableCell>
                </TableRow>
              ))
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="group hover:bg-zinc-50/50 transition-colors border-zinc-100">
                  <TableCell className="font-bold text-zinc-900">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm italic">
                    {category.description || 'Chưa có mô tả'}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs font-medium">
                    {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem 
                          onClick={() => openEditDialog(category)}
                          className="gap-2 font-bold text-zinc-600 focus:text-blue-600"
                        >
                          <Edit2 size={14} /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setDeletingId(category.id);
                            setIsConfirmDeleteOpen(true);
                          }}
                          className="gap-2 font-bold text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 size={14} /> Xóa danh mục
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                    <AlertCircle size={40} className="opacity-20" />
                    <p className="font-bold italic">Không tìm thấy ngành nghề nào.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {categoriesData && (
          <div className="p-4 border-t border-zinc-100">
            <Pagination
              currentPage={page}
              totalPages={categoriesData.meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase text-zinc-900">
                {editingCategory ? 'Chỉnh sửa ngành nghề' : 'Thêm ngành nghề mới'}
              </DialogTitle>
              <DialogDescription className="italic font-medium">
                Cung cấp các thông tin cần thiết để quản lý danh mục tuyển dụng.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Tên ngành nghề <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Công nghệ thông tin, Marketing..."
                  className="rounded-xl border-zinc-200 font-bold focus-visible:ring-blue-600"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Mô tả ngắn
                </Label>
                <Textarea
                  id="desc"
                  placeholder="Nhập mô tả cho ngành nghề này..."
                  className="rounded-xl border-zinc-200 min-h-[100px] font-medium focus-visible:ring-blue-600"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={closeDialog}
                className="rounded-xl font-bold text-zinc-500 hover:bg-zinc-100"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 px-6"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase text-zinc-900">
              Xác nhận xóa ngành nghề?
            </DialogTitle>
            <DialogDescription className="font-medium italic">
              Hành động này sẽ ẩn ngành nghề khỏi danh sách hiển thị cho người dùng và nhà tuyển dụng. Bạn có chắc chắn muốn tiếp tục?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsConfirmDeleteOpen(false)}
              className="rounded-xl font-bold text-zinc-500 hover:bg-zinc-100"
            >
              Không, quay lại
            </Button>
            <Button 
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 px-6"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đúng, hãy xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

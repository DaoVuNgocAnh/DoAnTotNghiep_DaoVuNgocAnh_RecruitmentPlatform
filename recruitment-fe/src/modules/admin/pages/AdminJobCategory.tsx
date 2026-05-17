import { AlertCircle, LayoutGrid, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/shared/Pagination';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminJobCategories } from '../hooks/useAdminJobCategories';
import { JobCategoryTable } from '../components/JobCategoryTable';
import { JobCategoryModal } from '../components/JobCategoryModal';

export const AdminJobCategory = () => {
  const {
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
    handleSubmit,
    deleteMutation,
    isMutating,
  } = useAdminJobCategories();

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

      <JobCategoryTable
        isLoading={isLoading}
        filteredCategories={filteredCategories}
        openEditDialog={openEditDialog}
        onDelete={(id) => {
          setDeletingId(id);
          setIsConfirmDeleteOpen(true);
        }}
      />

      {categoriesData && (
        <div className="p-4 border-t border-zinc-100">
          <Pagination
            currentPage={page}
            totalPages={categoriesData.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <JobCategoryModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCategory={editingCategory}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        description={description}
        setDescription={setDescription}
        handleSubmit={handleSubmit}
        isMutating={isMutating}
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase text-zinc-900 flex items-center gap-2">
              <AlertCircle className="text-red-500" /> Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-zinc-600 font-medium italic">
              Bạn có chắc chắn muốn xóa ngành nghề này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các tin tuyển dụng liên quan.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsConfirmDeleteOpen(false)} className="rounded-xl font-bold uppercase text-[10px]">
              Hủy bỏ
            </Button>
            <Button 
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl uppercase text-[10px] px-6"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

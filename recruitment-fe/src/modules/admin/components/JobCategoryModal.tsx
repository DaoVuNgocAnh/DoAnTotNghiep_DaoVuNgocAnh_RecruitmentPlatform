import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JobCategory } from '../api/jobCategoryApi';

interface JobCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: JobCategory | null;
  categoryName: string;
  setCategoryName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isMutating: boolean;
}

export const JobCategoryModal = ({
  isOpen,
  onOpenChange,
  editingCategory,
  categoryName,
  setCategoryName,
  description,
  setDescription,
  handleSubmit,
  isMutating,
}: JobCategoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ví dụ: Công nghệ thông tin"
                className="h-12 rounded-xl border-zinc-200 focus-visible:ring-blue-600 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Mô tả (Tùy chọn)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả ngắn về ngành nghề này..."
                className="rounded-xl border-zinc-200 focus-visible:ring-blue-600 min-h-[120px] font-medium"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              disabled={isMutating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl uppercase tracking-widest text-xs"
            >
              {isMutating ? <Loader2 className="animate-spin mr-2" /> : null}
              {editingCategory ? 'Cập nhật thay đổi' : 'Xác nhận thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

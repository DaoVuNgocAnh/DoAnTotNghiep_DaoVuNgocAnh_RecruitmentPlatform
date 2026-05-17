import { AlertCircle, Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { JobCategory } from '../api/jobCategoryApi';

interface JobCategoryTableProps {
  isLoading: boolean;
  filteredCategories: JobCategory[];
  openEditDialog: (category: JobCategory) => void;
  onDelete: (id: string) => void;
}

export const JobCategoryTable = ({
  isLoading,
  filteredCategories,
  openEditDialog,
  onDelete,
}: JobCategoryTableProps) => {
  return (
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
                        onClick={() => onDelete(category.id)}
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
    </div>
  );
};

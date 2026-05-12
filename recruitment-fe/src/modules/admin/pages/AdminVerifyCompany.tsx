import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal, 
  Search, 
  ExternalLink,
  ShieldAlert,
  Loader2,
  Info
} from 'lucide-react';
import { adminApi } from '../api/admin.api';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// UI COMPONENTS
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination } from '@/components/shared/Pagination';

export const AdminVerifyCompany = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-companies', page, statusFilter, searchTerm],
    queryFn: () => adminApi.getCompanies({ 
      page,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      search: searchTerm 
    }).then(res => res.data),
  });

  const companies = data?.data || [];
  const meta = data?.meta;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      adminApi.updateCompanyStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      toast.success(`Cập nhật trạng thái thành ${variables.status} thành công`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 font-bold">VERIFIED</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-3 font-bold">PENDING</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 font-bold">REJECTED</Badge>;
      case 'BLACKLIST':
        return <Badge className="bg-zinc-900 text-white hover:bg-zinc-900 border-none px-3 font-bold">BLACKLIST</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Phê duyệt doanh nghiệp</h1>
          <p className="text-zinc-500 text-sm font-medium italic">Kiểm soát tính minh bạch và pháp nhân của các công ty trên hệ thống.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <Input 
              placeholder="Tìm theo MST hoặc Tên..." 
              className="pl-10 w-[280px] bg-white rounded-xl border-zinc-200 focus-visible:ring-blue-600 h-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-800">Danh sách đăng ký</CardTitle>
              <CardDescription>Trang {page} - Hiển thị dữ liệu từ hệ thống</CardDescription>
            </div>
            <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
              {['ALL', 'PENDING', 'VERIFIED', 'REJECTED', 'BLACKLIST'].map((s) => (
                <button 
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                    statusFilter === s 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent border-b border-zinc-100">
                <TableHead className="font-bold text-zinc-800 px-8 py-4">Doanh nghiệp / Mô tả</TableHead>
                <TableHead className="font-bold text-zinc-800">Mã số thuế</TableHead>
                <TableHead className="font-bold text-zinc-800 text-center">Website</TableHead>
                <TableHead className="font-bold text-zinc-800">Trạng thái</TableHead>
                <TableHead className="font-bold text-zinc-800 text-right px-8">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
                    <p className="text-zinc-400 font-medium">Đang truy xuất dữ liệu hệ thống...</p>
                  </TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-zinc-400">
                    <Info className="mx-auto mb-2 opacity-20" size={48} />
                    Không tìm thấy dữ liệu phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company: any) => (
                  <TableRow key={company.id} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black border-2 border-white shadow-sm shrink-0">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 truncate">{company.name}</p>
                          <p className="text-xs text-zinc-400 truncate max-w-[300px] font-medium">{company.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono bg-zinc-100 px-2 py-1 rounded text-sm font-bold text-zinc-600">
                        {company.taxCode}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {company.websiteUrl ? (
                        <a 
                          href={company.websiteUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold text-xs"
                        >
                          TRUY CẬP <ExternalLink size={12} />
                        </a>
                      ) : <span className="text-zinc-300">---</span>}
                    </TableCell>
                    <TableCell>{renderStatusBadge(company.status)}</TableCell>
                    <TableCell className="text-right px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-200">
                            <MoreHorizontal size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-zinc-100 animate-in zoom-in-95">
                          <DropdownMenuLabel className="text-[10px] text-zinc-400 uppercase tracking-widest px-3 py-2">Thao tác cho phép</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {company.status === 'PENDING' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(company.id, 'VERIFIED')}
                                className="text-green-600 gap-3 cursor-pointer p-3 font-bold rounded-xl focus:bg-green-50 focus:text-green-700"
                              >
                                <CheckCircle2 size={18} /> Phê duyệt hồ sơ
                              </DropdownMenuItem>

                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(company.id, 'REJECTED')}
                                className="text-red-600 gap-3 cursor-pointer p-3 font-bold rounded-xl focus:bg-red-50 focus:text-red-700"
                              >
                                <XCircle size={18} /> Từ chối cấp phép
                              </DropdownMenuItem>
                            </>
                          )}

                          {company.status === 'VERIFIED' && (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(company.id, 'BLACKLIST')}
                              className="text-zinc-900 gap-3 cursor-pointer p-3 font-bold rounded-xl bg-zinc-50 hover:bg-zinc-100 focus:bg-zinc-900 focus:text-white"
                            >
                              <ShieldAlert size={18} /> Chặn (Blacklist)
                            </DropdownMenuItem>
                          )}

                          {(company.status === 'REJECTED' || company.status === 'BLACKLIST') && (
                            <div className="p-4 text-center">
                              <p className="text-[10px] text-zinc-400 italic font-medium leading-relaxed">
                                Hồ sơ đã ở trạng thái cuối. <br/> Không thể thay đổi thêm.
                              </p>
                            </div>
                          )}

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {meta && (
            <Pagination 
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
              className="border-t py-4"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

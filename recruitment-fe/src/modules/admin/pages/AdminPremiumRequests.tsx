import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../../employer/api/company.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Phone, Mail, MessageSquare, Loader2, Info, Building2, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Pagination } from '@/components/shared/Pagination';

export const AdminPremiumRequests = () => {
  const [currentStatus, setCurrentStatus] = useState<string>('PENDING');
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['admin-premium-requests', currentStatus, page],
    queryFn: () => companyApi.getAdminPremiumRequests({ 
      status: currentStatus === 'ALL' ? undefined : currentStatus,
      page,
      limit
    }).then(res => res.data),
  });

  const requests = requestsData?.data || [];

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const toastId = toast.loading("Đang xử lý yêu cầu...");
    try {
      await companyApi.handlePremiumRequest(id, status);
      toast.success(status === 'APPROVED' ? "Đã nâng cấp đối tác thành công" : "Đã từ chối yêu cầu", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['admin-premium-requests'] });
    } catch {
      toast.error("Thao tác thất bại", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Yêu cầu nâng cấp Premium</h1>
          <p className="text-zinc-500 text-sm font-medium italic">Xử lý các yêu cầu trở thành Đối tác Uy tín từ doanh nghiệp.</p>
        </div>
        
        <Tabs value={currentStatus} onValueChange={setCurrentStatus} className="w-fit">
          <TabsList className="bg-zinc-100 p-1 rounded-xl">
            <TabsTrigger value="ALL" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">TẤT CẢ</TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">ĐANG CHỜ</TabsTrigger>
            <TabsTrigger value="APPROVED" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">ĐÃ DUYỆT</TabsTrigger>
            <TabsTrigger value="REJECTED" className="rounded-lg font-bold text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">TỪ CHỐI</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-black text-zinc-800 px-8 py-5">Doanh nghiệp & Người gửi</TableHead>
              <TableHead className="font-black text-zinc-800">Thông tin liên hệ</TableHead>
              <TableHead className="font-black text-zinc-800">Ghi chú</TableHead>
              <TableHead className="font-black text-zinc-800 text-center">Trạng thái</TableHead>
              <TableHead className="font-black text-zinc-800 text-right px-8">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!requests || requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-zinc-400">
                  <Info className="mx-auto mb-2 opacity-20" size={48} />
                  Không có yêu cầu nâng cấp nào.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req: any) => (
                <TableRow key={req.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 font-black text-blue-600 uppercase text-[11px] tracking-widest">
                          <Building2 size={12} /> {req.company.name}
                       </div>
                       <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
                          <User size={12} className="text-zinc-400" /> {req.user.fullName}
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
                       <div className="flex items-center gap-2">
                          <Phone size={12} className="text-emerald-500" /> {req.contactPhone}
                       </div>
                       <div className="flex items-center gap-2">
                          <Mail size={12} className="text-blue-500" /> {req.contactEmail}
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                     <div className="flex items-start gap-2 text-xs text-zinc-500 italic">
                        <MessageSquare size={12} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{req.note || "Không có ghi chú"}</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "border-none px-3 font-black text-[10px]",
                      req.status === 'PENDING' ? "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200" :
                      req.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" :
                      "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                    )}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    {req.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:bg-red-50 font-bold rounded-xl h-9 px-4"
                          onClick={() => handleAction(req.id, 'REJECTED')}
                        >
                          <X size={16} className="mr-1"/> Từ chối
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-100 h-9 px-4"
                          onClick={() => handleAction(req.id, 'APPROVED')}
                        >
                          <Check size={16} className="mr-1"/> Duyệt VIP
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {requestsData && (
          <div className="p-4 border-t border-zinc-100">
            <Pagination
              currentPage={page}
              totalPages={requestsData.meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

import { useEffect, useState } from 'react';
import {
  UserCheck,
  UserX,
  Clock,
  Mail,
  Calendar,
  Users,
  Loader2,
  Info,
} from 'lucide-react';
import { companyApi } from '../api/company.api';
import { toast } from 'sonner';

// UI COMPONENTS CỦA BẠN
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export const ManageMembers = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await companyApi.getJoinRequests();
      setRequests(res.data);
    } catch (error) {
      toast.error('Không thể lấy danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (
    requestId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    const message =
      status === 'ACCEPTED' ? 'Đang chấp thuận...' : 'Đang từ chối...';
    const toastId = toast.loading(message);

    try {
      await companyApi.handleJoinRequest(requestId, status);
      toast.success(
        status === 'ACCEPTED'
          ? 'Đã thêm thành viên vào công ty'
          : 'Đã từ chối yêu cầu',
        { id: toastId }
      );
      fetchRequests(); // Load lại danh sách
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại', {
        id: toastId,
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Phê duyệt nhân sự
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Danh sách các tài khoản HR đang xin gia nhập hệ thống của bạn.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Users className="text-[#00b14f]" size={20} />
          <span className="text-sm font-bold text-slate-700">
            {requests.length} Yêu cầu mới
          </span>
        </div>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b px-8 py-6">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock size={20} className="text-yellow-500" />
            Yêu cầu đang chờ duyệt
          </CardTitle>
          <CardDescription>
            Vui lòng kiểm tra kỹ thông tin trước khi cấp quyền truy cập
            Dashboard cho thành viên mới.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b border-slate-100">
                <TableHead className="font-bold text-slate-800 px-8 py-4">
                  Nhân sự
                </TableHead>
                <TableHead className="font-bold text-slate-800">
                  Email liên hệ
                </TableHead>
                <TableHead className="font-bold text-slate-800 text-center">
                  Ngày gửi
                </TableHead>
                <TableHead className="font-bold text-slate-800">
                  Trạng thái
                </TableHead>
                <TableHead className="font-bold text-slate-800 text-right px-8">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2
                      className="animate-spin mx-auto text-[#00b14f] mb-2"
                      size={32}
                    />
                    <p className="text-slate-400 font-medium">
                      Đang tải danh sách...
                    </p>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-20 text-slate-400"
                  >
                    <Info className="mx-auto mb-2 opacity-20" size={48} />
                    Hiện tại chưa có HR nào xin gia nhập công ty bạn.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((item: any) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-50"
                  >
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                          <AvatarImage src={item.user.avatarUrl} />
                          <AvatarFallback className="bg-green-100 text-[#00b14f] font-bold">
                            {item.user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.user.fullName}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-bold py-0 h-4 border-slate-200 text-slate-400"
                          >
                            Recruiter
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-sm">{item.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center text-slate-500">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Calendar size={12} />
                          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-none font-bold">
                        PENDING
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl gap-1"
                          onClick={() => handleAction(item.id, 'REJECTED')}
                        >
                          <UserX size={16} /> Từ chối
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#00b14f] hover:bg-[#009643] text-white font-bold rounded-xl gap-1 shadow-lg shadow-green-100"
                          onClick={() => handleAction(item.id, 'ACCEPTED')}
                        >
                          <UserCheck size={16} /> Chấp thuận
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

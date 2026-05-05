import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, Mail, Search, Shield, Unlock, UserCog, Users } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi, type AdminUser } from '../api/admin.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const roles = ['ALL', 'ADMIN', 'EMPLOYER', 'CANDIDATE'] as const;
const statuses = ['ALL', 'ACTIVE', 'LOCKED'] as const;

const roleTone: Record<AdminUser['role'], string> = {
  ADMIN: 'bg-blue-50 text-blue-600 ring-blue-500/20',
  EMPLOYER: 'bg-green-50 text-green-600 ring-green-500/20',
  CANDIDATE: 'bg-purple-50 text-purple-600 ring-purple-500/20',
};

export const AdminUserList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<(typeof roles)[number]>('ALL');
  const [status, setStatus] = useState<(typeof statuses)[number]>('ALL');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: 'ACTIVE' | 'LOCKED' }) =>
      adminApi.updateUserStatus(id, nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Cập nhật trạng thái người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
    },
  });

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !keyword ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.company?.name?.toLowerCase().includes(keyword);
      const matchesRole = role === 'ALL' || user.role === role;
      const matchesStatus = status === 'ALL' || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [role, search, status, users]);

  const lockedCount = users.filter((user) => user.status === 'LOCKED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
            Quản lý người dùng
          </h1>
          <p className="mt-1 text-sm font-medium italic text-zinc-500">
            Theo dõi tài khoản, vai trò và trạng thái hoạt động trong hệ thống.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="text-blue-600" size={22} />
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400">Tổng user</p>
                <p className="text-xl font-black text-zinc-900">{users.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <Lock className="text-red-600" size={22} />
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400">Đang khóa</p>
                <p className="text-xl font-black text-zinc-900">{lockedCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-3xl border-none shadow-sm">
        <CardHeader className="gap-4 border-b">
          <CardTitle className="flex items-center gap-2 text-base font-black uppercase text-zinc-800">
            <UserCog size={18} /> Danh sách tài khoản
          </CardTitle>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên, email, công ty..."
                className="h-10 rounded-xl bg-zinc-50 pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={role === item ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-xl font-black"
                  onClick={() => setRole(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={status === item ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-xl font-black"
                  onClick={() => setStatus(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow>
                <TableHead className="px-8 py-4 font-black text-zinc-800">Người dùng</TableHead>
                <TableHead className="font-black text-zinc-800">Vai trò</TableHead>
                <TableHead className="font-black text-zinc-800">Công ty</TableHead>
                <TableHead className="font-black text-zinc-800">Trạng thái</TableHead>
                <TableHead className="px-8 text-right font-black text-zinc-800">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center text-sm font-bold text-zinc-400">
                    Đang tải danh sách người dùng...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center text-sm font-bold text-zinc-400">
                    Không tìm thấy người dùng phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 rounded-2xl">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback className="rounded-2xl bg-blue-50 font-black text-blue-600">
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-zinc-900">{user.fullName}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-zinc-400">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-none font-black ring-1 ${roleTone[user.role]}`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-bold text-zinc-500">
                      {user.company?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === 'ACTIVE'
                            ? 'border-none bg-green-50 font-black text-green-600 ring-1 ring-green-500/20 hover:bg-green-50'
                            : 'border-none bg-red-50 font-black text-red-600 ring-1 ring-red-500/20 hover:bg-red-50'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      {user.role === 'ADMIN' ? (
                        <Badge className="border-none bg-zinc-100 font-black text-zinc-500 hover:bg-zinc-100">
                          <Shield size={12} className="mr-1" /> Protected
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={
                            user.status === 'ACTIVE'
                              ? 'rounded-xl font-bold text-red-600 hover:bg-red-50'
                              : 'rounded-xl font-bold text-green-600 hover:bg-green-50'
                          }
                          disabled={updateStatusMutation.isPending}
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: user.id,
                              nextStatus: user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE',
                            })
                          }
                        >
                          {user.status === 'ACTIVE' ? (
                            <>
                              <Lock size={14} className="mr-1" /> Khóa
                            </>
                          ) : (
                            <>
                              <Unlock size={14} className="mr-1" /> Mở khóa
                            </>
                          )}
                        </Button>
                      )}
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

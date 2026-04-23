import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { Role } from '@/types/role'; 
import { User, Mail, Lock, UserCheck, ArrowRight } from 'lucide-react';

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.nativeEnum(Role, {
    message: 'Vui lòng chọn vai trò của bạn',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: Role.CANDIDATE,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await authApi.register(values);
      toast.success('Tạo tài khoản thành công! Hãy đăng nhập để bắt đầu.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f4f7f6] px-4 py-12">
      <Card className="w-full max-w-[500px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-2 pt-10">
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Tạo tài khoản
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium text-base">
            Gia nhập cộng đồng nhân sự lớn nhất Việt Nam
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Họ và tên</FormLabel>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={20} />
                    <FormControl>
                      <Input 
                        placeholder="Nguyễn Văn A" 
                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" 
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Địa chỉ Email</FormLabel>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={20} />
                    <FormControl>
                      <Input 
                        placeholder="name@example.com" 
                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" 
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Mật khẩu</FormLabel>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={20} />
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" 
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Vai trò của bạn</FormLabel>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 text-slate-400 z-10" size={20} />
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-[#00b14f] font-medium">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value={Role.CANDIDATE} className="cursor-pointer py-3 font-bold text-slate-700">
                          Ứng viên tìm việc
                        </SelectItem>
                        <SelectItem value={Role.EMPLOYER} className="cursor-pointer py-3 font-bold text-slate-700">
                          Nhà tuyển dụng
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex gap-2 mt-2 uppercase tracking-widest text-xs"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Đang xử lý..." : "Đăng ký tài khoản"}
                {!form.formState.isSubmitting && <ArrowRight size={18} />}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col px-10 pb-10">
          <Separator className="mb-6 opacity-60" />
          <p className="text-slate-500 text-sm font-medium">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#00b14f] font-black hover:text-[#009643] transition-colors hover:underline">
              ĐĂNG NHẬP TẠI ĐÂY
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
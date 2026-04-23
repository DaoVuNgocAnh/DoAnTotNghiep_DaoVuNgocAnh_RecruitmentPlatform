import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query'; // IMPORT THÊM

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  rememberMe: z.boolean().default(false).optional(),
});

export const LoginPage = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient(); // KHỞI TẠO QUERY CLIENT
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await authApi.login(values);
      const { access_token } = res.data;

      // 1. XÓA SẠCH CACHE CỦA NGƯỜI DÙNG TRƯỚC (QUAN TRỌNG NHẤT)
      // Việc này ép useUser() phải gọi lại API để lấy role của người vừa đăng nhập
      queryClient.clear();

      // 2. LƯU TOKEN VÀO ZUSTAND
      setAuth(access_token);
      
      toast.success('Đăng nhập thành công!');
      
      // 3. KHÔNG NAVIGATE TẠI ĐÂY. 
      // AuthedRedirect ở file Router sẽ tự động thấy dữ liệu User đổi và đẩy bạn đi đúng hướng.
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f4f7f6] px-4 py-12">
      <Card className="w-full max-w-[450px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-2 pt-10">
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
            Chào mừng trở lại
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium text-base">
            Cùng xây dựng sự nghiệp rạng rỡ cùng SmartCV
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Email đăng nhập</FormLabel>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={20} />
                    <FormControl>
                      <Input 
                        placeholder="email@gmail.com" 
                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium text-slate-800" 
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-widest">Mật khẩu</FormLabel>
                    <Link to="#" className="text-xs text-[#00b14f] hover:underline font-bold tracking-tighter">Quên mật khẩu?</Link>
                  </div>
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

              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" onCheckedChange={(checked) => form.setValue('rememberMe', !!checked)} />
                <label htmlFor="rememberMe" className="text-[11px] font-bold text-slate-500 cursor-pointer uppercase tracking-tighter">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-[0.98] flex gap-2 uppercase tracking-widest text-xs"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Đang xác thực..." : "Đăng nhập hệ thống"}
                {!form.formState.isSubmitting && <ArrowRight size={18} />}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col px-10 pb-10">
          <Separator className="mb-6 opacity-60" />
          <p className="text-slate-500 text-sm font-medium">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#00b14f] font-black hover:text-[#009643] transition-colors tracking-tight">
              ĐĂNG KÝ NGAY
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
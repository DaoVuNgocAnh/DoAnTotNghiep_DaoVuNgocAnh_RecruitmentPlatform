import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  PlusCircle,
  Globe,
  FileText,
  Hash,
  ArrowLeft,
  Send,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { companyApi } from '../api/company.api';

// UI Components - Đã thêm Badge và loại bỏ các import không dùng
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge'; // FIX LỖI THIẾU BADGE

const createCompanySchema = z.object({
  name: z.string().min(3, 'Tên công ty ít nhất 3 ký tự'),
  taxCode: z.string().min(10, 'Mã số thuế phải có ít nhất 10 số'),
  description: z.string().min(10, 'Mô tả ít nhất 10 ký tự'),
  websiteUrl: z
    .string()
    .url('Website không hợp lệ')
    .optional()
    .or(z.literal('')),
  logoUrl: z.string().optional(),
});

type CreateCompanyValues = z.infer<typeof createCompanySchema>;

export const EmployerSetupPage = () => {
  const [step, setStep] = useState<'choice' | 'create' | 'join'>('choice');
  const [taxCodeSearch, setTaxCodeSearch] = useState('');
  const [foundCompany, setFoundCompany] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<CreateCompanyValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: { name: '', taxCode: '', description: '', websiteUrl: '' },
  });

  // --- LOGIC 1: TÌM KIẾM CÔNG TY ---
  const handleSearch = async () => {
    if (!taxCodeSearch) return toast.error('Vui lòng nhập mã số thuế');
    setIsSearching(true);
    try {
      const res = await companyApi.searchByTaxCode(taxCodeSearch);
      setFoundCompany(res.data);
    } catch (error: any) {
      setFoundCompany(null);
      toast.error(error.response?.data?.message || 'Không tìm thấy công ty');
    } finally {
      setIsSearching(false);
    }
  };

  // --- LOGIC 2: XIN GIA NHẬP (Mutation) ---
  const joinMutation = useMutation({
    mutationFn: (companyId: string) => companyApi.sendJoinRequest(companyId),
    onSuccess: () => {
      toast.success('Gửi yêu cầu gia nhập thành công!');
      // Invalidate query để useUser() lấy lại profile mới có pendingJoinRequest
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      // EmployerGuard sẽ tự động đưa sang trang JoinPendingPage
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại');
    }
  });

  // --- LOGIC 3: TẠO CÔNG TY MỚI (Mutation) ---
  const createCompanyMutation = useMutation({
    mutationFn: (values: CreateCompanyValues) => companyApi.createCompany(values),
    onSuccess: () => {
      toast.success('Đăng ký hồ sơ công ty thành công!');
      // Ép fetch lại profile user để cập nhật companyId và companyStatus: 'PENDING'
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      // Quay về route gốc để Guard tính toán lại trang Chờ duyệt
      navigate('/employer', { replace: true });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo công ty thất bại');
    }
  });

  const onCreateSubmit = (values: CreateCompanyValues) => {
    createCompanyMutation.mutate(values);
  };

  const handleJoin = () => {
    if (foundCompany) joinMutation.mutate(foundCompany.id);
  };

  if (step === 'choice') {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
          <Card
            className="group hover:border-[#00b14f] transition-all cursor-pointer shadow-xl border-2 border-transparent rounded-3xl overflow-hidden"
            onClick={() => setStep('create')}
          >
            <CardHeader className="text-center pt-10">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00b14f] transition-all duration-300 group-hover:rotate-6">
                <PlusCircle size={40} className="text-[#00b14f] group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Tôi là chủ doanh nghiệp</CardTitle>
              <CardDescription className="px-6 font-medium">Đăng ký hồ sơ pháp nhân để đăng tin tuyển dụng.</CardDescription>
            </CardHeader>
            <CardContent className="pb-10 text-center">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-[#00b14f] text-[#00b14f]">Yêu cầu Mã số thuế</Badge>
            </CardContent>
          </Card>

          <Card
            className="group hover:border-blue-500 transition-all cursor-pointer shadow-xl border-2 border-transparent rounded-3xl overflow-hidden"
            onClick={() => setStep('join')}
          >
            <CardHeader className="text-center pt-10">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-all duration-300 group-hover:-rotate-6">
                <Search size={40} className="text-blue-500 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Tôi là nhân viên HR</CardTitle>
              <CardDescription className="px-6 font-medium">Gia nhập vào một công ty đã có sẵn trên hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="pb-10 text-center">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-blue-500 text-blue-500">Cần sếp phê duyệt</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6 py-12">
      <Card className="max-w-2xl w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none animate-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-8 border-b border-slate-50 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setStep('choice'); setFoundCompany(null); }}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              {step === 'create' ? 'Pháp nhân doanh nghiệp' : 'Tìm kiếm đối tác'}
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
              {step === 'create' ? 'Cung cấp thông tin để xác thực hệ thống' : 'Sử dụng mã số thuế để định danh công ty'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {step === 'join' ? (
            <div className="space-y-8 px-4">
              <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <Input 
                    placeholder="Mã số thuế (10 hoặc 13 số)..." 
                    className="pl-10 h-14 rounded-xl border-none bg-transparent focus-visible:ring-0 font-bold text-lg text-slate-700" 
                    value={taxCodeSearch}
                    onChange={(e) => setTaxCodeSearch(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl font-black shadow-lg shadow-blue-200"
                >
                  {isSearching ? <Loader2 className="animate-spin" size={24} /> : 'TÌM KIẾM'}
                </Button>
              </div>

              {foundCompany && (
                <div className="p-8 border-2 border-blue-100 rounded-[2rem] bg-blue-50/20 flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 shadow-sm">
                  <div className="w-20 h-20 bg-white rounded-3xl border-2 border-white shadow-xl flex items-center justify-center text-3xl font-black text-blue-600 shrink-0 uppercase">
                    {foundCompany.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase leading-tight">{foundCompany.name}</h4>
                    <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest leading-none">MST: {foundCompany.taxCode}</p>
                  </div>
                  <Button
                    onClick={handleJoin}
                    disabled={joinMutation.isPending}
                    className="bg-[#00b14f] hover:bg-[#009643] rounded-2xl gap-2 font-black px-8 py-6 shadow-xl shadow-green-100 transition-all active:scale-95 h-auto"
                  >
                    {joinMutation.isPending ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    XIN GIA NHẬP
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-6 px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Tên công ty</FormLabel>
                      <div className="relative group">
                        <Building2 className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
                        <FormControl><Input placeholder="Cty TNHH SmartCV" className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" {...field} /></FormControl>
                      </div>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="taxCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Mã số thuế</FormLabel>
                      <div className="relative group">
                        <Hash className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
                        <FormControl><Input placeholder="0101234567" className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" {...field} /></FormControl>
                      </div>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Website chính thức</FormLabel>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
                      <FormControl><Input placeholder="https://smartcv.vn" className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#00b14f] font-medium" {...field} /></FormControl>
                    </div>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-[10px] uppercase text-slate-500 tracking-[0.15em]">Mô tả doanh nghiệp</FormLabel>
                    <div className="relative group">
                      <FileText className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00b14f] transition-colors" size={18} />
                      <FormControl><Textarea placeholder="Giới thiệu ngắn về lĩnh vực hoạt động..." className="pl-10 rounded-xl min-h-[120px] pt-3 focus-visible:ring-[#00b14f] border-slate-200 font-medium" {...field} /></FormControl>
                    </div>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )} />

                <Separator className="my-6 opacity-50" />

                <Button
                  type="submit"
                  className="w-full h-14 bg-[#00b14f] hover:bg-[#009643] text-white font-black rounded-2xl shadow-xl shadow-green-100 transition-all text-lg active:scale-[0.98]"
                  disabled={createCompanyMutation.isPending}
                >
                  {createCompanyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      ĐANG XÁC THỰC...
                    </>
                  ) : (
                    'HOÀN TẤT ĐĂNG KÝ DOANH NGHIỆP'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t py-6 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 text-center px-10 leading-relaxed uppercase tracking-tighter font-bold">
            Dữ liệu sẽ được gửi tới Admin hệ thống để đối soát pháp nhân. <br/>Quá trình phê duyệt diễn ra trong 24h làm việc.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
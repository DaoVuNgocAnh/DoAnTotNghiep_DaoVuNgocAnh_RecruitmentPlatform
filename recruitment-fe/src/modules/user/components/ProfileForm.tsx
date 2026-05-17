import type { UseFormReturn } from 'react-hook-form';
import { Award, Edit3, Save, User as UserIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ProfileFormValues } from '../hooks/useProfile';

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onSubmit: (values: ProfileFormValues) => void;
  updateProfileMutation: any;
}

export const ProfileForm = ({
  form,
  isEditing,
  setIsEditing,
  onSubmit,
  updateProfileMutation,
}: ProfileFormProps) => {
  return (
    <div className="lg:col-span-8">
      <Card className="border-transparent shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardHeader className="p-8 md:p-10 pb-0 flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon size={20} />
              </div>
              Chi tiết hồ sơ
            </h2>
          </div>
          <Button
            variant={isEditing ? 'ghost' : 'outline'}
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 transition-all",
              isEditing ? 'text-slate-400' : 'border-primary text-primary hover:bg-primary hover:text-white'
            )}
          >
            {isEditing ? <><X size={14} className="mr-2" /> Hủy</> : <><Edit3 size={14} className="mr-2" /> Chỉnh sửa</>}
          </Button>
        </CardHeader>

        <CardContent className="p-8 md:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Họ tên đầy đủ</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Ngày sinh</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Số điện thoại</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Địa chỉ</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                      <Award size={12} className="text-primary" /> Kỹ năng chuyên môn
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="VD: React, Node.js, UI/UX..." disabled={!isEditing} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Giới thiệu bản thân</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={!isEditing}
                        placeholder="Chia sẻ ngắn gọn về kinh nghiệm và định hướng nghề nghiệp của bạn..."
                        className="min-h-[160px] rounded-2xl border-slate-100 bg-slate-50 font-medium leading-relaxed focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="rounded-2xl bg-primary hover:bg-[#009643] font-black uppercase tracking-widest text-[11px] h-12 px-10 shadow-xl shadow-green-900/20 transition-all hover:scale-105"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin mr-2" />
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

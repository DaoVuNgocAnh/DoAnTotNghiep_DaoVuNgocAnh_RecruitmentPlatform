import { useState } from 'react';
import {
  useResumes,
  useUploadResume,
  useDeleteResume,
  useSetDefaultResume,
} from '../api/resume.api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle,
  ExternalLink,
  Loader2,
  Plus,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export const MyResumesPage = () => {
  const { data: resumes, isLoading } = useResumes();
  const uploadMutation = useUploadResume();
  const deleteMutation = useDeleteResume();
  const setDefaultMutation = useSetDefaultResume();

  const [file, setFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [open, setOpen] = useState(false);

  const handleUpload = async () => {
    if (!file || !resumeName)
      return toast.error('Vui lòng nhập tên và chọn file');

    const formData = new FormData();
    
    // Client-side validation
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return toast.error('Chỉ chấp nhận file định dạng PDF, DOC, DOCX');
    }

    if (file.size > 10 * 1024 * 1024) { // 5MB
      return toast.error('Kích thước file không được vượt quá 10MB');
    }

    formData.append('file', file);
    formData.append('resumeName', resumeName);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Tải lên CV thành công!');
        setOpen(false);
        setFile(null);
        setResumeName('');
      },
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Quản lý CV
          </h1>
          <p className="text-slate-500 font-medium italic">
            Tải lên các bản CV để sẵn sàng ứng tuyển mọi lúc.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00b14f] hover:bg-[#009643] rounded-2xl gap-2 font-black shadow-lg shadow-green-100 h-12 px-6">
              <Plus size={20} /> TẢI LÊN CV MỚI
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase text-[#00b14f]">
                Tải lên hồ sơ
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">
                  Tên gợi nhớ CV
                </label>
                <Input
                  placeholder="Ví dụ: CV Fullstack Developer - 2024"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">
                  Chọn file (PDF/Docx)
                </label>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="rounded-xl h-12 pt-2.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="w-full bg-[#00b14f] font-black rounded-2xl h-12"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Upload className="mr-2" size={18} />
                )}
                XÁC NHẬN TẢI LÊN
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#00b14f]" size={40} />
        </div>
      ) : resumes?.length === 0 ? (
        <Card className="border-dashed border-2 py-20 text-center rounded-[2rem] bg-slate-50/50">
          <FileText
            className="mx-auto text-slate-300 mb-4 opacity-30"
            size={64}
          />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Bạn chưa có bản CV nào trên hệ thống
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumes?.map((resume) => (
            <Card
              key={resume.id}
              className={`group rounded-[2rem] border-2 transition-all duration-300 ${resume.isDefault ? 'border-[#00b14f] bg-green-50/10' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl border shadow-sm flex items-center justify-center text-red-500 shrink-0">
                    <FileText size={30} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-slate-800 truncate uppercase text-sm leading-none">
                        {resume.resumeName}
                      </h3>
                      {resume.isDefault && (
                        <Badge className="bg-[#00b14f] text-white text-[9px] font-black h-4 px-1.5 uppercase border-none">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Tải lên:{' '}
                      {new Date(resume.uploadedAt).toLocaleDateString('vi-VN')}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest"
                      >
                        <ExternalLink size={12} /> XEM FILE ONLINE
                      </a>
                      {!resume.isDefault && (
                        <button
                          onClick={() => setDefaultMutation.mutate(resume.id)}
                          disabled={setDefaultMutation.isPending}
                          className="text-[10px] font-black text-[#00b14f] hover:underline flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> ĐẶT MẶC ĐỊNH
                        </button>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    onClick={() => {
                      if (confirm('Xóa CV này?'))
                        deleteMutation.mutate(resume.id);
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10 p-6 bg-[#001529] rounded-[2rem] text-white flex items-center gap-4 shadow-xl">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
          <Info size={24} className="text-[#00b14f]" />
        </div>
        <div>
          <p className="font-bold text-sm">Mẹo nhỏ:</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Hãy đặt CV tốt nhất của bạn làm **Mặc định** để hệ thống ưu tiên sử
            dụng khi bạn nhấn "Ứng tuyển nhanh" tại các tin tuyển dụng.
          </p>
        </div>
      </div>
    </div>
  );
};

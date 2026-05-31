import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MoreVertical,
  ShieldCheck,
  FileCheck,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/shared/Pagination';

export const MyResumesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: resumesData, isLoading } = useResumes({ page, limit });
  const resumes = resumesData?.data || [];
  const officialResumes = resumes.filter((r: any) => !r.isDraft);
  const uploadMutation = useUploadResume();
  const deleteMutation = useDeleteResume();
  const setDefaultMutation = useSetDefaultResume();

  const [file, setFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [open, setOpen] = useState(false);

  const [draftsDialogOpen, setDraftsDialogOpen] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  const handleOpenDrafts = () => {
    const serverDrafts = resumes.filter((r: any) => r.isDraft).map((r: any) => {
      let parsedData = {};
      try {
        parsedData = r.draftData ? JSON.parse(r.draftData) : {};
      } catch (e) {
        console.error(e);
      }
      return {
        id: r.id,
        name: r.resumeName,
        updatedAt: r.uploadedAt,
        fileUrl: r.fileUrl,
        ...parsedData
      };
    });

    serverDrafts.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setDrafts(serverDrafts);
    setDraftsDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!file || !resumeName)
      return toast.error('Vui lòng nhập tên và chọn file');

    const formData = new FormData();
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return toast.error('Chỉ chấp nhận file định dạng PDF, DOC, DOCX');
    }

    if (file.size > 10 * 1024 * 1024) {
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
    <div className="container mx-auto py-12 px-4 max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Hồ sơ CV của tôi</h1>
          <p className="text-slate-500 font-medium italic mt-1">Quản lý các phiên bản CV để tối ưu khả năng ứng tuyển.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleOpenDrafts}
            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl gap-2 font-black shadow-sm h-12 px-8 uppercase tracking-widest text-xs transition-all active:scale-95"
          >
            <Plus size={18} className="text-primary" /> Tự tạo CV online
          </Button>

          <Dialog open={draftsDialogOpen} onOpenChange={setDraftsDialogOpen}>
            <DialogContent className="rounded-[2rem] max-w-lg border-none">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase text-slate-900">Danh sách bản nháp CV</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto pr-1">
                {drafts.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 font-medium italic text-xs">
                    Chưa có bản nháp nào được lưu.
                  </div>
                ) : (
                  drafts.map((draft) => (
                    <div key={draft.id} className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors">
                      <div className="min-w-0 flex-1 pr-4">
                        <h4 className="font-bold text-slate-800 text-xs truncate uppercase leading-none mb-1">{draft.name || 'CV Chưa đặt tên'}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                          Cập nhật: {new Date(draft.updatedAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => {
                            setDraftsDialogOpen(false);
                            navigate(`/resumes/create?draftId=${draft.id}`);
                          }}
                          className="bg-primary hover:bg-primary/95 text-white rounded-xl text-[10px] font-black h-8 px-3 uppercase tracking-wider"
                        >
                          Sửa tiếp
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa bản nháp này?')) {
                              deleteMutation.mutate(draft.id, {
                                onSuccess: () => {
                                  toast.success('Đã xóa bản nháp thành công!');
                                  setDrafts(prev => prev.filter((d: any) => d.id !== draft.id));
                                }
                              });
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-8 w-8"
                        >
                          {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDraftsDialogOpen(false)}
                  className="rounded-xl font-bold text-xs uppercase h-11 border-slate-200"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setDraftsDialogOpen(false);
                    navigate('/resumes/create');
                  }}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-xs uppercase h-11 px-5 tracking-wider shadow-md"
                >
                  <Plus size={16} className="mr-1.5" /> Tạo CV mới
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-2xl gap-2 font-black shadow-lg shadow-primary/20 h-12 px-8 uppercase tracking-widest text-xs transition-all active:scale-95">
                <Upload size={18} /> Tải lên CV mới
              </Button>
            </DialogTrigger>
          <DialogContent className="rounded-[2rem] max-w-md border-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase text-slate-900">Tải lên hồ sơ mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tên gợi nhớ CV</label>
                <Input
                  placeholder="Ví dụ: CV Fullstack Developer - 2024"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className="rounded-xl h-12 border-slate-100 bg-slate-50 font-bold focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Chọn tệp tin (PDF, DOCX)</label>
                <div className="relative group cursor-pointer">
                   <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="rounded-xl h-24 border-2 border-dashed border-slate-200 bg-slate-50/50 pt-10 text-center cursor-pointer group-hover:border-primary/50 transition-colors"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                     <Upload size={24} className="mb-2 text-primary" />
                     <span className="text-[10px] font-bold uppercase">{file ? file.name : "Nhấn để chọn tệp"}</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="w-full bg-primary font-black rounded-xl h-12 uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
              >
                {uploadMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" size={18} />}
                XÁC NHẬN TẢI LÊN
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse shadow-sm border border-slate-50"></div>)}
        </div>
      ) : officialResumes?.length === 0 ? (
        <Card className="border-dashed border-2 py-32 text-center rounded-[3rem] bg-white shadow-inner">
          <FileText className="mx-auto text-slate-200 mb-6 opacity-20" size={80} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-lg">Chưa có CV nào</p>
          <p className="text-slate-400 font-medium mt-2 italic">Hãy tải lên bản CV tốt nhất của bạn để bắt đầu ứng tuyển.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officialResumes?.map((resume: any) => (
            <Card
              key={resume.id}
              className={cn(
                "group rounded-[2.5rem] border-transparent shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 bg-white overflow-hidden active:scale-[0.99]",
                resume.isDefault && "ring-2 ring-primary/20 bg-primary/[0.02]"
              )}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <FileText size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-slate-900 truncate uppercase text-sm group-hover:text-primary transition-colors">
                        {resume.resumeName}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(resume.uploadedAt).toLocaleDateString('vi-VN')}</span>
                       {resume.isDraft ? (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 uppercase border-none rounded-full">
                          Bản nháp
                        </Badge>
                       ) : (
                         resume.isDefault && (
                          <Badge className="bg-primary text-white text-[9px] font-black px-2 py-0.5 uppercase border-none rounded-full flex items-center gap-1">
                            <FileCheck size={10} /> Mặc định
                          </Badge>
                        )
                       )}
                    </div>

                    <div className="flex gap-4 mt-6">
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1.5 uppercase tracking-[0.15em] transition-colors"
                      >
                        <ExternalLink size={12} /> Xem online
                      </a>
                      {resume.isDraft ? (
                        <button
                          onClick={() => navigate(`/resumes/create?draftId=${resume.id}`)}
                          className="text-[10px] font-black text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1.5 uppercase tracking-[0.15em]"
                        >
                          <FileText size={12} /> Sửa tiếp
                        </button>
                      ) : (
                        !resume.isDefault && (
                          <button
                            onClick={() => setDefaultMutation.mutate(resume.id)}
                            disabled={setDefaultMutation.isPending}
                            className="text-[10px] font-black text-primary hover:underline flex items-center gap-1.5 uppercase tracking-[0.15em]"
                          >
                            <CheckCircle size={12} /> Đặt mặc định
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600 rounded-full h-8 w-8">
                          <MoreVertical size={18} />
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-100 p-2 shadow-xl">
                       <DropdownMenuItem 
                        className="text-rose-500 font-bold focus:text-rose-600 focus:bg-rose-50 gap-2 cursor-pointer rounded-lg"
                        onClick={() => { if (confirm('Bạn có chắc chắn muốn xóa bản CV này?')) deleteMutation.mutate(resume.id); }}
                       >
                          <Trash2 size={14} /> Xóa hồ sơ
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {resumesData && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={resumesData.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-slate-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <Info size={28} className="text-primary" />
        </div>
        <div>
          <p className="font-black uppercase tracking-widest text-xs text-primary mb-1">Mẹo tối ưu hồ sơ</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">
            Hãy đặt CV tốt nhất của bạn làm **Mặc định**. Hệ thống sẽ ưu tiên sử dụng bản CV này khi bạn thực hiện các thao tác "Ứng tuyển nhanh" tại các tin tuyển dụng hot.
          </p>
        </div>
      </div>
    </div>
  );
};

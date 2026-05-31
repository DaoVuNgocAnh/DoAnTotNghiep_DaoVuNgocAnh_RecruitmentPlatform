import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Loader2
} from 'lucide-react';
import { CVBuilderProvider, useCVBuilder } from '../components/CVBuilderContext';
import { CVConfigSidebar } from '../components/CVConfigSidebar';
import { CVQuickManual } from '../components/CVQuickManual';
import { FormatToolbar } from '../components/FormatToolbar';
import { CVPreview } from '../components/CVPreview';

const CVBuilderContent = () => {
  const navigate = useNavigate();
  const {
    isSaving,
    isDraftSaving,
    isPublishSaving,
    isGenerating,
    isLoadingDraft,
    blocker,
    handleDownloadPDF,
    handleSaveCV,
  } = useCVBuilder();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
      {/* Loading Overlay */}
      {isLoadingDraft && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-3 border border-slate-100">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-slate-700 font-bold text-xs uppercase tracking-widest">Đang tải bản nháp...</p>
          </div>
        </div>
      )}

      {/* Scoped CSS overrides to restore list rendering inside CV preview against Tailwind resets */}
      <style dangerouslySetInnerHTML={{ __html: `
        #cv-preview-container ul {
          list-style-type: disc !important;
          padding-left: 20px !important;
          margin-top: 4px !important;
          margin-bottom: 4px !important;
        }
        #cv-preview-container ol {
          list-style-type: decimal !important;
          padding-left: 20px !important;
          margin-top: 4px !important;
          margin-bottom: 4px !important;
        }
        #cv-preview-container li {
          display: list-item !important;
          margin-bottom: 2px !important;
        }
        div[contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
      `}} />

      {/* Warning modal when leaving route without saving */}
      {blocker.state === 'blocked' && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) blocker.reset(); }}>
          <DialogContent className="rounded-3xl border-none bg-white p-6 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-black uppercase text-slate-800 tracking-wider">
                Bạn chưa lưu thay đổi
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs text-slate-500 font-medium leading-relaxed my-2">
              Các thông tin vừa sửa đổi trên bản CV chưa được lưu nháp lên hệ thống. Bạn có chắc chắn muốn rời đi?
            </p>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row-reverse sm:justify-end pt-2 w-full">
              <Button
                disabled={isGenerating || isSaving}
                onClick={async () => {
                  await handleSaveCV(true);
                }}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl text-[11px] font-bold uppercase h-10"
              >
                {isDraftSaving && <Loader2 size={12} className="animate-spin mr-1" />}
                Lưu nháp & Thoát
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  blocker.proceed();
                }}
                className="w-full sm:w-auto rounded-xl text-[11px] font-bold uppercase h-10"
              >
                Thoát không lưu
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  blocker.reset();
                }}
                className="w-full sm:w-auto rounded-xl text-[11px] font-bold uppercase h-10"
              >
                Hủy bỏ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/resumes')}
            className="rounded-full border border-slate-200 bg-white shadow-sm"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">Trình soạn thảo CV trực quan</h1>
            <p className="text-slate-500 font-medium text-xs">Biên tập trực tiếp trên Bản xem trước CV. Di chuột vào tiêu đề mục lớn và bấm nút '+' để chèn mục lớn tự chọn mới phía sau.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleDownloadPDF} 
            disabled={isGenerating || isSaving}
            className="rounded-2xl gap-2 font-black border-slate-200 h-11 px-5 text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Tải PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSaveCV(true)} 
            disabled={isGenerating || isSaving}
            className="rounded-2xl gap-2 font-black border-slate-200 h-11 px-5 text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all"
          >
            {isDraftSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Lưu nháp
          </Button>
          <Button 
            onClick={() => handleSaveCV(false)} 
            disabled={isGenerating || isSaving}
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl gap-2 font-black h-11 px-6 text-xs uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all"
          >
            {isPublishSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Lưu & Xuất bản
          </Button>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left 3 cols) and Visual Editor (Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR SETTINGS PANEL */}
        <div className="lg:col-span-3 space-y-6">
          <CVConfigSidebar />
          <CVQuickManual />
        </div>

        {/* VISUAL WYSIWYG EDITOR CANVAS (CV preview) */}
        <div className="lg:col-span-9 flex flex-col items-center w-full">
          <div className="w-full bg-slate-100 rounded-[2.5rem] p-6 border border-slate-200/50 shadow-inner flex flex-col items-center overflow-x-auto">
            <FormatToolbar />
            <CVPreview />
          </div>
        </div>

      </div>
    </div>
  );
};

export const CVBuilderPage = () => {
  return (
    <CVBuilderProvider>
      <CVBuilderContent />
    </CVBuilderProvider>
  );
};
export default CVBuilderPage;

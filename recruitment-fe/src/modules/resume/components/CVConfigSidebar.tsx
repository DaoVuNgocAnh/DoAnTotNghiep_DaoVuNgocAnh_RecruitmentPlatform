import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCVBuilder } from './CVBuilderContext';
import { COLOR_THEME_KEYS } from '../constants/resume-builder.constants';

export const CVConfigSidebar = () => {
  const {
    resumeName,
    setResumeName,
    layout,
    setLayout,
    colorTheme,
    setColorTheme,
    isCustomTheme,
  } = useCVBuilder();

  return (
    <Card className="rounded-[2rem] border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] bg-white overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-black uppercase text-slate-900 flex items-center gap-2">
          <Layout size={18} className="text-primary" /> Thiết lập chung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* CV Name Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Tên tệp lưu trữ
          </label>
          <Input 
            value={resumeName} 
            onChange={(e) => setResumeName(e.target.value)} 
            placeholder="Ví dụ: CV NodeJS - 2024" 
            className="rounded-xl h-11 border-slate-100 bg-slate-50 focus-visible:ring-primary font-bold text-xs"
          />
        </div>

        {/* Template Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Mẫu giao diện
          </label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant={layout === 'modern' ? 'default' : 'outline'}
              onClick={() => setLayout('modern')}
              className="rounded-xl font-bold text-[11px] uppercase py-4 justify-start px-4 h-10"
            >
              Mẫu 2 cột (Hiện đại)
            </Button>
            <Button
              variant={layout === 'classic' ? 'default' : 'outline'}
              onClick={() => setLayout('classic')}
              className="rounded-xl font-bold text-[11px] uppercase py-4 justify-start px-4 h-10"
            >
              Mẫu 1 cột (Cổ điển)
            </Button>
          </div>
        </div>

        {/* Theme Colors selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
            <Palette size={12} /> Tông màu chủ đạo
          </label>
          <div className="flex flex-wrap gap-2.5 pt-1 items-center">
            {COLOR_THEME_KEYS.map((theme) => (
              <button
                key={theme}
                onClick={() => setColorTheme(theme)}
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center relative",
                  theme === 'emerald' && "bg-emerald-600 border-emerald-700",
                  theme === 'blue' && "bg-blue-600 border-blue-700",
                  theme === 'indigo' && "bg-indigo-600 border-indigo-700",
                  theme === 'violet' && "bg-violet-600 border-violet-700",
                  theme === 'slate' && "bg-slate-700 border-slate-800",
                  colorTheme === theme ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-80 hover:opacity-100"
                )}
              />
            ))}
            
            {/* Custom color picker circular button */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <input
                type="color"
                id="custom-theme-color"
                value={isCustomTheme ? colorTheme : '#10b981'}
                onChange={(e) => setColorTheme(e.target.value)}
                className={cn(
                  "w-7 h-7 rounded-full border-2 cursor-pointer overflow-hidden p-0 bg-transparent transition-all",
                  isCustomTheme ? "ring-2 ring-primary ring-offset-2 scale-110 border-slate-400" : "border-slate-300 opacity-80 hover:opacity-100"
                )}
                title="Chọn màu chủ đạo tùy chỉnh"
              />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
export default CVConfigSidebar;

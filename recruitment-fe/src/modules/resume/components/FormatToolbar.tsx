import { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Type, 
  Layout, 
  Eraser 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCVBuilder } from './CVBuilderContext';
import type { CVFont } from '../types/resume-builder.types';

const rgbToHex = (rgb: string): string => {
  if (!rgb) return '#000000';
  if (rgb.startsWith('#')) return rgb;
  const match = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return rgb;
};

export const FormatToolbar = () => {
  const {
    activeFormats,
    applyFormat,
    isFormatActive,
    fontStyle,
    setFontStyle
  } = useCVBuilder();

  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  // Close dropdowns on window click
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowSizeDropdown(false);
      setShowColorDropdown(false);
      setShowFontDropdown(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div 
      className="sticky top-4 z-30 w-full max-w-[210mm] mb-6 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2.5 transition-all select-none animate-in fade-in slide-in-from-top-2 duration-300"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-wrap items-center gap-1">
        {/* Text Styles */}
        {[
          { cmd: 'bold', title: 'In đậm (Ctrl+B)', icon: <Bold size={15} /> },
          { cmd: 'italic', title: 'In nghiêng (Ctrl+I)', icon: <Italic size={15} /> },
          { cmd: 'underline', title: 'Gạch chân (Ctrl+U)', icon: <Underline size={15} /> },
          { cmd: 'strikeThrough', title: 'Gạch ngang', icon: <Strikethrough size={15} /> }
        ].map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat(btn.cmd); }}
            className={cn(
              "p-1.5 rounded-lg border transition-all",
              isFormatActive(btn.cmd)
                ? "bg-slate-200/80 text-slate-950 border-slate-300 shadow-inner scale-95"
                : "border-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900"
            )}
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Alignment */}
        {[
          { cmd: 'justifyLeft', title: 'Căn lề trái', icon: <AlignLeft size={15} /> },
          { cmd: 'justifyCenter', title: 'Căn lề giữa', icon: <AlignCenter size={15} /> },
          { cmd: 'justifyRight', title: 'Căn lề phải', icon: <AlignRight size={15} /> }
        ].map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat(btn.cmd); }}
            className={cn(
              "p-1.5 rounded-lg border transition-all",
              isFormatActive(btn.cmd)
                ? "bg-slate-200/80 text-slate-950 border-slate-300 shadow-inner scale-95"
                : "border-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900"
            )}
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Lists */}
        {[
          { cmd: 'insertUnorderedList', title: 'Danh sách dấu chấm', icon: <List size={15} /> },
          { cmd: 'insertOrderedList', title: 'Danh sách số', icon: <ListOrdered size={15} /> }
        ].map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat(btn.cmd); }}
            className={cn(
              "p-1.5 rounded-lg border transition-all",
              isFormatActive(btn.cmd)
                ? "bg-slate-200/80 text-slate-950 border-slate-300 shadow-inner scale-95"
                : "border-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900"
            )}
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowSizeDropdown(!showSizeDropdown);
              setShowColorDropdown(false);
              setShowFontDropdown(false);
            }}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          >
            <Type size={14} />
            <span>Cỡ chữ</span>
          </button>
          {showSizeDropdown && (
            <div 
              className="absolute left-0 top-9 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-1 flex flex-col gap-0.5 min-w-[130px] animate-in fade-in slide-in-from-top-1 duration-250"
              onMouseDown={(e) => e.preventDefault()}
            >
              {[
                { label: 'Nhỏ nhất (10px)', value: '1' },
                { label: 'Nhỏ (12px)', value: '2' },
                { label: 'Vừa (14px)', value: '3' },
                { label: 'Lớn (16px)', value: '4' },
                { label: 'Lớn hơn (18px)', value: '5' },
                { label: 'Rất lớn (24px)', value: '6' },
                { label: 'Lớn nhất (32px)', value: '7' }
              ].map((sz) => (
                <button
                  key={sz.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyFormat('fontSize', sz.value);
                    setShowSizeDropdown(false);
                  }}
                  className="px-2.5 py-1.5 text-left text-xs font-medium hover:bg-slate-50 rounded-lg text-slate-700 transition-colors w-full"
                >
                  {sz.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Style Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowFontDropdown(!showFontDropdown);
              setShowSizeDropdown(false);
              setShowColorDropdown(false);
            }}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          >
            <Layout size={14} />
            <span>Phông chữ ({fontStyle === 'font-sans' ? 'Sans' : fontStyle === 'font-serif' ? 'Serif' : 'Mono'})</span>
          </button>
          {showFontDropdown && (
            <div 
              className="absolute left-0 top-9 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-1 flex flex-col gap-0.5 min-w-[135px] animate-in fade-in slide-in-from-top-1 duration-250"
              onMouseDown={(e) => e.preventDefault()}
            >
              {[
                { label: 'Sans (Hiện đại)', value: 'font-sans' },
                { label: 'Serif (Truyền thống)', value: 'font-serif' },
                { label: 'Mono (Công nghệ)', value: 'font-mono' }
              ].map((ft) => (
                <button
                  key={ft.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setFontStyle(ft.value as CVFont);
                    setShowFontDropdown(false);
                  }}
                  className={cn(
                    "px-2.5 py-1.5 text-left text-xs font-medium hover:bg-slate-50 rounded-lg transition-colors w-full",
                    fontStyle === ft.value ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-700"
                  )}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Color picker area */}
      <div className="flex items-center gap-1.5">
        {/* Color Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowColorDropdown(!showColorDropdown);
              setShowSizeDropdown(false);
              setShowFontDropdown(false);
            }}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          >
            <span 
              className="w-3.5 h-3.5 rounded-full border border-slate-300 transition-colors" 
              style={{ backgroundColor: rgbToHex(activeFormats.color) }}
            />
            <span>Màu chữ</span>
          </button>
          {showColorDropdown && (
            <div 
              className="absolute right-0 lg:left-0 top-9 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-2 grid grid-cols-4 gap-1.5 min-w-[140px] animate-in fade-in slide-in-from-top-1 duration-250"
              onMouseDown={(e) => e.preventDefault()}
            >
              {[
                { hex: '#000000', label: 'Đen' },
                { hex: '#4b5563', label: 'Xám đậm' },
                { hex: '#9ca3af', label: 'Xám nhạt' },
                { hex: '#ffffff', label: 'Trắng', border: 'border border-slate-300' },
                { hex: '#ef4444', label: 'Đỏ' },
                { hex: '#f97316', label: 'Cam' },
                { hex: '#eab308', label: 'Vàng' },
                { hex: '#10b981', label: 'Xanh lá' },
                { hex: '#3b82f6', label: 'Xanh dương' },
                { hex: '#6366f1', label: 'Indigo' },
                { hex: '#8b5cf6', label: 'Tím' },
                { hex: '#f43f5e', label: 'Hồng' }
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyFormat('foreColor', c.hex);
                    setShowColorDropdown(false);
                  }}
                  className={cn(
                    "w-6 h-6 rounded-lg hover:scale-110 active:scale-95 transition-transform",
                    c.border
                  )}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Clear Format */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); applyFormat('removeFormat'); }}
          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
          title="Xóa định dạng"
        >
          <Eraser size={16} />
        </button>
      </div>
    </div>
  );
};
export default FormatToolbar;

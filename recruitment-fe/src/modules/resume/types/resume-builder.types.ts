export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  school: string;
  major: string;
  duration: string;
  description: string;
}

export interface Project {
  name: string;
  tech: string;
  role: string;
  description: string;
}

export interface SectionConfig {
  id: string; // 'bio' | 'skills' | 'experience' | 'education' | 'projects' | 'custom_...'
  title: string;
  visible: boolean;
  isCustom?: boolean;
  content?: string; // Cho mục tự chọn
  column?: 1 | 2; // Cột hiển thị trong layout modern (1 = cột trái, 2 = cột phải)
}

export type ColorTheme = string;
export type CVLayout = 'classic' | 'modern';
export type CVFont = 'font-sans' | 'font-serif' | 'font-mono';

export interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  color: string;
  fontSize: string;
}

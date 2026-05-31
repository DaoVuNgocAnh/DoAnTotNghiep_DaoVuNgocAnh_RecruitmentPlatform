export interface ThemeConfig {
  primary: string;
  text: string;
  border: string;
  accent: string;
  headerText: string;
  sidebarBg: string;
  sidebarText: string;
}

export const THEME_COLORS: Record<string, ThemeConfig> = {
  slate: {
    primary: 'bg-slate-800',
    text: 'text-slate-800',
    border: 'border-slate-800',
    accent: 'bg-slate-50',
    headerText: 'text-slate-900',
    sidebarBg: 'bg-slate-900',
    sidebarText: 'text-white',
  },
  blue: {
    primary: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    accent: 'bg-blue-50',
    headerText: 'text-blue-900',
    sidebarBg: 'bg-blue-950',
    sidebarText: 'text-white',
  },
  emerald: {
    primary: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    accent: 'bg-emerald-50',
    headerText: 'text-emerald-900',
    sidebarBg: 'bg-emerald-950',
    sidebarText: 'text-white',
  },
  indigo: {
    primary: 'bg-indigo-600',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    accent: 'bg-indigo-50',
    headerText: 'text-indigo-900',
    sidebarBg: 'bg-indigo-950',
    sidebarText: 'text-white',
  },
  violet: {
    primary: 'bg-violet-600',
    text: 'text-violet-600',
    border: 'border-violet-600',
    accent: 'bg-violet-50',
    headerText: 'text-violet-900',
    sidebarBg: 'bg-violet-950',
    sidebarText: 'text-white',
  },
};

export const COLOR_THEME_KEYS = ['emerald', 'blue', 'indigo', 'violet', 'slate'] as const;

export const FONT_STYLES = [
  { id: 'font-sans', name: 'Sans-serif (Hiện đại)' },
  { id: 'font-serif', name: 'Serif (Truyền thống)' },
  { id: 'font-mono', name: 'Monospace (Công nghệ)' },
] as const;

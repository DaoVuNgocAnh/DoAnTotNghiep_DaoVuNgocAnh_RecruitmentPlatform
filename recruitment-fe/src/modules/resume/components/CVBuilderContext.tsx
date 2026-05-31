import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useBlocker } from 'react-router-dom';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { 
  Experience, 
  Education, 
  Project, 
  SectionConfig, 
  ColorTheme, 
  CVLayout, 
  CVFont,
  ActiveFormats
} from '../types/resume-builder.types';
import { THEME_COLORS } from '../constants/resume-builder.constants';
import type { ThemeConfig } from '../constants/resume-builder.constants';
import { useUploadResume, resumeApi } from '../api/resume.api';

// Utility helper to darken color for contrast
const darkenColor = (hex: string, percent: number): string => {
  if (!hex || !hex.startsWith('#')) return '#0f172a';
  const rawHex = hex.replace('#', '');
  const num = parseInt(rawHex, 16);
  const amt = Math.round(2.55 * percent);
  let R = (num >> 16) - amt;
  let G = (num >> 8 & 0x00FF) - amt;
  let B = (num & 0x0000FF) - amt;
  
  R = R < 0 ? 0 : R > 255 ? 255 : R;
  G = G < 0 ? 0 : G > 255 ? 255 : G;
  B = B < 0 ? 0 : B > 255 ? 255 : B;
  
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

interface CVBuilderContextType {
  // Navigation & API
  draftId: string | null;
  isSaving: boolean;
  isDraftSaving: boolean;
  isPublishSaving: boolean;
  isGenerating: boolean;
  isLoadingDraft: boolean;
  blocker: ReturnType<typeof useBlocker>;
  isSaved: boolean;
  setIsSaved: (val: boolean) => void;
  
  // General settings state
  resumeName: string;
  setResumeName: (val: string) => void;
  colorTheme: ColorTheme;
  setColorTheme: (val: ColorTheme) => void;
  layout: CVLayout;
  setLayout: (val: CVLayout) => void;
  fontStyle: CVFont;
  setFontStyle: (val: CVFont) => void;
  
  // Section configs
  sections: SectionConfig[];
  setSections: React.Dispatch<React.SetStateAction<SectionConfig[]>>;
  
  // Personal & content states
  fullName: string;
  setFullName: (val: string) => void;
  targetJobTitle: string;
  setTargetJobTitle: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  website: string;
  setWebsite: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  skills: string;
  setSkills: (val: string) => void;
  
  // Lists
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;

  // Ref container for html2canvas
  previewRef: React.RefObject<HTMLDivElement | null>;
  
  // Formatting state
  activeFormats: ActiveFormats;
  setActiveFormats: React.Dispatch<React.SetStateAction<ActiveFormats>>;
  applyFormat: (command: string, value?: string) => void;
  isFormatActive: (cmd: string) => boolean;
  
  // Theme helpers
  isCustomTheme: boolean;
  currentTheme: ThemeConfig;
  
  // Section Actions
  addCustomSectionAfter: (id: string) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  removeCustomSection: (id: string) => void;
  renameSection: (id: string, newTitle: string) => void;
  updateCustomSectionContent: (id: string, content: string) => void;

  // Item list actions
  addExperienceAfter: (index: number) => void;
  removeExperience: (index: number) => void;
  moveExperienceUp: (index: number) => void;
  moveExperienceDown: (index: number) => void;
  
  addEducationAfter: (index: number) => void;
  removeEducation: (index: number) => void;
  moveEducationUp: (index: number) => void;
  moveEducationDown: (index: number) => void;
  
  addProjectAfter: (index: number) => void;
  removeProject: (index: number) => void;
  moveProjectUp: (index: number) => void;
  moveProjectDown: (index: number) => void;

  // Key handlers
  handleSingleLineKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  
  // Core actions
  generatePDFBlob: () => Promise<Blob | null>;
  handleDownloadPDF: () => Promise<void>;
  handleSaveCV: (isDraft?: boolean) => Promise<void>;
}

const CVBuilderContext = createContext<CVBuilderContextType | undefined>(undefined);

export const CVBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  const uploadMutation = useUploadResume();
  const previewRef = useRef<HTMLDivElement | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const loadedDraftIdRef = useRef<string | null>(null);
  const [savingMode, setSavingMode] = useState<'draft' | 'publish' | null>(null);

  // Router blocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return !isSaved && currentLocation.pathname !== nextLocation.pathname;
    }
  );

  // States
  const [resumeName, setResumeName] = useState('CV Trực Tuyến Chỉnh Sửa Trực Tiếp');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('emerald');
  const [layout, setLayout] = useState<CVLayout>('modern');
  const [fontStyle, setFontStyle] = useState<CVFont>('font-sans');

  const [sections, setSections] = useState<SectionConfig[]>([
    { id: 'bio', title: 'Giới thiệu bản thân', visible: true, column: 2 },
    { id: 'skills', title: 'Các kỹ năng', visible: true, column: 1 },
    { id: 'experience', title: 'Kinh nghiệm làm việc', visible: true, column: 2 },
    { id: 'education', title: 'Học vấn', visible: true, column: 2 },
    { id: 'projects', title: 'Dự án tiêu biểu', visible: true, column: 2 },
  ]);

  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [targetJobTitle, setTargetJobTitle] = useState('Frontend Developer');
  const [email, setEmail] = useState('nguyenvana@gmail.com');
  const [phone, setPhone] = useState('0987654321');
  const [address, setAddress] = useState('Quận 1, TP. Hồ Chí Minh');
  const [website, setWebsite] = useState('https://github.com/nguyenvana');
  const [bio, setBio] = useState('Tôi là một kỹ sư phần mềm trẻ nhiệt huyết với hơn 2 năm kinh nghiệm thiết kế giao diện ứng dụng web hiện đại. Đam mê tối ưu hóa trải nghiệm người dùng và xây dựng các hệ thống hiệu năng cao.');
  const [skills, setSkills] = useState('React, TypeScript, Next.js, Tailwind CSS, HTML5, CSS3, JavaScript, Git');
  
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: 'Công ty Công nghệ Alpha',
      role: 'Frontend Developer',
      duration: '06/2023 - Hiện tại',
      description: 'Phát triển giao diện hệ thống CRM doanh nghiệp sử dụng React 18 & Tailwind CSS. Tối ưu hóa 40% thời gian tải trang ban đầu.'
    },
    {
      company: 'Công ty Solution Beta',
      role: 'Web Developer Intern',
      duration: '01/2023 - 05/2023',
      description: 'Hỗ trợ cắt giao diện HTML/CSS từ bản vẽ Figma, xây dựng các trang Landing Page quảng bá sản phẩm.'
    }
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      school: 'Đại học Bách Khoa TP.HCM',
      major: 'Công nghệ thông tin',
      duration: '2019 - 2023',
      description: 'Tốt nghiệp loại Giỏi. GPA: 3.4/4.0'
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      name: 'Hệ thống SmartCV Platform',
      tech: 'React, Vite, TailwindCSS, Zustand',
      role: 'Frontend Lead',
      description: 'Xây dựng module quản lý CV trực quan cho ứng viên và bảng điều khiển trực quan cho nhà tuyển dụng.'
    }
  ]);

  // Toolbar & Formats
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    unorderedList: false,
    orderedList: false,
    color: '#0f172a',
    fontSize: '3',
  });

  const lastSelectionRef = useRef<Range | null>(null);

  // Before unload confirmation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaved]);

  // Load draft from backend
  useEffect(() => {
    if (!draftId) {
      return;
    }
    if (draftId.startsWith('draft_')) {
      navigate('/resumes/create', { replace: true });
      return;
    }
    if (draftId === loadedDraftIdRef.current) {
      return;
    }

    loadedDraftIdRef.current = draftId;
    setIsLoadingDraft(true);

    resumeApi.getResumeById(draftId)
      .then((res: any) => {
        const resume = res.data;
        if (resume && resume.draftData) {
          try {
            const draft = JSON.parse(resume.draftData);
            setResumeName(resume.resumeName || draft.name || 'CV Trực Tuyến Chỉnh Sửa Trực Tiếp');
            setColorTheme(draft.colorTheme || 'emerald');
            setLayout(draft.layout || 'modern');
            setFontStyle(draft.fontStyle || 'font-sans');
            setFullName(draft.fullName || 'Nguyễn Văn A');
            setTargetJobTitle(draft.targetJobTitle || 'Frontend Developer');
            setEmail(draft.email || 'nguyenvana@gmail.com');
            setPhone(draft.phone || '0987654321');
            setAddress(draft.address || 'Quận 1, TP. Hồ Chí Minh');
            setWebsite(draft.website || 'https://github.com/nguyenvana');
            setBio(draft.bio || 'Tôi là một kỹ sư phần mềm trẻ nhiệt huyết với hơn 2 năm kinh nghiệm thiết kế giao diện ứng dụng web hiện đại. Đam mê tối ưu hóa trải nghiệm người dùng và xây dựng các hệ thống hiệu năng cao.');
            setSkills(draft.skills || 'React, TypeScript, Next.js, Tailwind CSS, HTML5, CSS3, JavaScript, Git');
            setExperiences(draft.experiences || []);
            setEducations(draft.educations || []);
            setProjects(draft.projects || []);
            setSections(draft.sections || [
              { id: 'bio', title: 'Giới thiệu bản thân', visible: true, column: 2 },
              { id: 'skills', title: 'Các kỹ năng', visible: true, column: 1 },
              { id: 'experience', title: 'Kinh nghiệm làm việc', visible: true, column: 2 },
              { id: 'education', title: 'Học vấn', visible: true, column: 2 },
              { id: 'projects', title: 'Dự án tiêu biểu', visible: true, column: 2 },
            ]);
          } catch (e) {
            console.error('Error parsing draftData:', e);
            toast.error('Lỗi phân tích cú pháp bản nháp. Khôi phục mặc định.');
            setResumeName(resume.resumeName || 'CV Trực Tuyến Chỉnh Sửa Trực Tiếp');
          }
        } else if (resume) {
          setResumeName(resume.resumeName || 'CV Trực Tuyến');
          toast.info('Đây là CV tải lên từ tệp tĩnh, không hỗ trợ soạn thảo trực tuyến.');
        }
      })
      .catch((err: any) => {
        console.error(err);
        toast.error('Không thể tải bản nháp từ máy chủ.');
        navigate('/resumes');
      })
      .finally(() => {
        setIsLoadingDraft(false);
      });
  }, [draftId, navigate]);

  // Track selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = document.getElementById('cv-preview-container');
        if (container && container.contains(range.commonAncestorContainer)) {
          lastSelectionRef.current = range.cloneRange();
          
          try {
            const colorVal = document.queryCommandValue('foreColor');
            const sizeVal = document.queryCommandValue('fontSize');
            
            setActiveFormats({
              bold: document.queryCommandState('bold'),
              italic: document.queryCommandState('italic'),
              underline: document.queryCommandState('underline'),
              strikeThrough: document.queryCommandState('strikeThrough'),
              alignLeft: document.queryCommandState('justifyLeft'),
              alignCenter: document.queryCommandState('justifyCenter'),
              alignRight: document.queryCommandState('justifyRight'),
              unorderedList: document.queryCommandState('insertUnorderedList'),
              orderedList: document.queryCommandState('insertOrderedList'),
              color: colorVal || '#0f172a',
              fontSize: sizeVal || '3',
            });
          } catch (e) {
            // ignore command query errors
          }
        }
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Theme Helpers
  const isCustomTheme = colorTheme.startsWith('#');
  const currentTheme: ThemeConfig = isCustomTheme
    ? {
        primary: colorTheme,
        text: colorTheme,
        border: colorTheme,
        accent: colorTheme + '10',
        headerText: darkenColor(colorTheme, 15),
        sidebarBg: darkenColor(colorTheme, 30),
        sidebarText: '#ffffff'
      }
    : THEME_COLORS[colorTheme] || THEME_COLORS.emerald;

  // Single-line Key Handler
  const handleSingleLineKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  // Formatting operations
  const applyFormat = (command: string, value: string = '') => {
    if (lastSelectionRef.current) {
      const selection = window.getSelection();
      if (selection) {
        let node = lastSelectionRef.current.startContainer;
        while (node && node.nodeType !== Node.ELEMENT_NODE) {
          node = node.parentNode!;
        }
        if (node) {
          const editable = (node as HTMLElement).closest('[contenteditable="true"]');
          if (editable) {
            (editable as HTMLElement).focus();
          }
        }
        selection.removeAllRanges();
        selection.addRange(lastSelectionRef.current);
      }
    }

    if (command === 'removeFormat') {
      document.execCommand('removeFormat', false, '');
      document.execCommand('foreColor', false, '#0f172a');
      document.execCommand('fontSize', false, '3');
    } else {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand(command, false, value);
    }

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      lastSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const isFormatActive = (cmd: string) => {
    switch (cmd) {
      case 'bold': return activeFormats.bold;
      case 'italic': return activeFormats.italic;
      case 'underline': return activeFormats.underline;
      case 'strikeThrough': return activeFormats.strikeThrough;
      case 'justifyLeft': return activeFormats.alignLeft;
      case 'justifyCenter': return activeFormats.alignCenter;
      case 'justifyRight': return activeFormats.alignRight;
      case 'insertUnorderedList': return activeFormats.unorderedList;
      case 'insertOrderedList': return activeFormats.orderedList;
      default: return false;
    }
  };

  // Section structural actions
  const addCustomSectionAfter = (id: string) => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    const parentSection = sections[index];
    const newSection: SectionConfig = {
      id: `custom_${Date.now()}`,
      title: 'Mục mới (Click để sửa tên)',
      visible: true,
      isCustom: true,
      column: parentSection.column || 2,
      content: ''
    };
    const updated = [...sections];
    updated.splice(index + 1, 0, newSection);
    setSections(updated);
    toast.success('Đã chèn thêm mục lớn tự chọn mới phía sau');
  };

  const moveSectionUp = (id: string) => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    const currentSection = sections[index];
    
    let prevIndex = -1;
    for (let i = index - 1; i >= 0; i--) {
      if ((sections[i].column || 2) === (currentSection.column || 2)) {
        prevIndex = i;
        break;
      }
    }
    
    if (prevIndex === -1) return;
    
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[prevIndex];
    updated[prevIndex] = temp;
    setSections(updated);
    toast.success('Đã chuyển mục lớn lên trên');
  };

  const moveSectionDown = (id: string) => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    const currentSection = sections[index];
    
    let nextIndex = -1;
    for (let i = index + 1; i < sections.length; i++) {
      if ((sections[i].column || 2) === (currentSection.column || 2)) {
        nextIndex = i;
        break;
      }
    }
    
    if (nextIndex === -1) return;
    
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setSections(updated);
    toast.success('Đã chuyển mục lớn xuống dưới');
  };

  const removeCustomSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    toast.success('Đã xóa mục lớn tự tạo');
  };

  const renameSection = (id: string, newTitle: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const updateCustomSectionContent = (id: string, content: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  // Experience actions
  const addExperienceAfter = (index: number) => {
    const updated = [...experiences];
    updated.splice(index + 1, 0, { company: 'Tên Công Ty Mới', role: 'Vị trí làm việc', duration: 'Thời gian', description: 'Mô tả công việc của bạn ở đây.' });
    setExperiences(updated);
    toast.success('Đã thêm mục kinh nghiệm mới');
  };
  const removeExperience = (index: number) => {
    if (experiences.length === 1) {
      toast.error('Phải giữ lại ít nhất 1 mục kinh nghiệm');
      return;
    }
    setExperiences(experiences.filter((_, i) => i !== index));
    toast.success('Đã xóa mục kinh nghiệm');
  };
  const moveExperienceUp = (index: number) => {
    if (index === 0) return;
    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setExperiences(updated);
  };
  const moveExperienceDown = (index: number) => {
    if (index === experiences.length - 1) return;
    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setExperiences(updated);
  };

  // Education actions
  const addEducationAfter = (index: number) => {
    const updated = [...educations];
    updated.splice(index + 1, 0, { school: 'Trường học mới', major: 'Chuyên ngành học', duration: 'Thời gian', description: 'Thông tin bổ sung.' });
    setEducations(updated);
    toast.success('Đã thêm mục học vấn mới');
  };
  const removeEducation = (index: number) => {
    if (educations.length === 1) {
      toast.error('Phải giữ lại ít nhất 1 mục học vấn');
      return;
    }
    setEducations(educations.filter((_, i) => i !== index));
    toast.success('Đã xóa mục học vấn');
  };
  const moveEducationUp = (index: number) => {
    if (index === 0) return;
    const updated = [...educations];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setEducations(updated);
  };
  const moveEducationDown = (index: number) => {
    if (index === educations.length - 1) return;
    const updated = [...educations];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setEducations(updated);
  };

  // Project actions
  const addProjectAfter = (index: number) => {
    const updated = [...projects];
    updated.splice(index + 1, 0, { name: 'Dự án mới', tech: 'Công nghệ sử dụng', role: 'Vai trò của bạn', description: 'Mô tả dự án và kết quả đạt được.' });
    setProjects(updated);
    toast.success('Đã thêm mục dự án mới');
  };
  const removeProject = (index: number) => {
    if (projects.length === 1) {
      toast.error('Phải giữ lại ít nhất 1 mục dự án');
      return;
    }
    setProjects(projects.filter((_, i) => i !== index));
    toast.success('Đã xóa mục dự án');
  };
  const moveProjectUp = (index: number) => {
    if (index === 0) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setProjects(updated);
  };
  const moveProjectDown = (index: number) => {
    if (index === projects.length - 1) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setProjects(updated);
  };

  // PDF Generator helper
  const generatePDFBlob = async (): Promise<Blob | null> => {
    const element = previewRef.current;
    if (!element) return null;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Có lỗi xảy ra khi tạo tệp PDF');
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    if (!fullName) {
      toast.error('Họ và tên trên bản xem trước không được để trống');
      return;
    }
    setIsGenerating(true);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const blob = await generatePDFBlob();
    setIsGenerating(false);

    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fullName.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Đã tải xuống file PDF thành công!');
    }
  };

  const handleSaveCV = async (isDraft: boolean = false) => {
    if (!resumeName) {
      toast.error('Vui lòng nhập tên lưu trữ CV ở cột bên trái');
      return;
    }
    if (!fullName) {
      toast.error('Họ và tên trên bản xem trước không được để trống');
      return;
    }

    setSavingMode(isDraft ? 'draft' : 'publish');
    setIsGenerating(true);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const blob = await generatePDFBlob();
    if (!blob) {
      setIsGenerating(false);
      setSavingMode(null);
      return;
    }

    const file = new File([blob], `${resumeName.replace(/\s+/g, '_') || 'online_cv'}.pdf`, {
      type: 'application/pdf',
    });

    const plainSkillsText = skills.replace(/<\/?[^>]+(>|$)/g, ""); 

    const formData = new FormData();
    formData.append('file', file);
    formData.append('resumeName', resumeName);
    formData.append('isDefault', 'false');
    formData.append('parsedJobTitle', targetJobTitle.replace(/<\/?[^>]+(>|$)/g, ""));
    formData.append('parsedSkills', plainSkillsText);
    formData.append('isDraft', isDraft ? 'true' : 'false');
    
    const draftDataObject = {
      name: resumeName,
      fullName,
      targetJobTitle,
      email,
      phone,
      address,
      website,
      bio,
      skills,
      experiences,
      educations,
      projects,
      sections,
      colorTheme,
      layout,
      fontStyle
    };
    formData.append('draftData', JSON.stringify(draftDataObject));

    if (draftId && !draftId.startsWith('draft_')) {
      formData.append('id', draftId);
    }

    uploadMutation.mutate(formData, {
      onSuccess: (res: any) => {
        setIsSaved(true);
        setIsGenerating(false);
        setSavingMode(null);
        if (isDraft) {
          toast.success('Đã lưu nháp CV thành công!');
          if (res.data?.id) {
            loadedDraftIdRef.current = res.data.id;
            navigate(`/resumes/create?draftId=${res.data.id}`, { replace: true });
          }
          if (blocker.state === 'blocked') {
            blocker.proceed();
          }
        } else {
          toast.success('Đã xuất bản CV trực tuyến thành công!');
          setTimeout(() => navigate('/resumes'), 100);
        }
      },
      onError: (err: any) => {
        setIsGenerating(false);
        setSavingMode(null);
        toast.error(err.response?.data?.message || 'Không thể lưu CV');
      }
    });
  };

  return (
    <CVBuilderContext.Provider value={{
      draftId,
      isSaving: uploadMutation.isPending,
      isDraftSaving: uploadMutation.isPending && savingMode === 'draft',
      isPublishSaving: uploadMutation.isPending && savingMode === 'publish',
      isGenerating,
      isLoadingDraft,
      blocker,
      isSaved,
      setIsSaved,
      
      resumeName,
      setResumeName,
      colorTheme,
      setColorTheme,
      layout,
      setLayout,
      fontStyle,
      setFontStyle,
      
      sections,
      setSections,
      
      fullName,
      setFullName,
      targetJobTitle,
      setTargetJobTitle,
      email,
      setEmail,
      phone,
      setPhone,
      address,
      setAddress,
      website,
      setWebsite,
      bio,
      setBio,
      skills,
      setSkills,
      
      experiences,
      setExperiences,
      educations,
      setEducations,
      projects,
      setProjects,

      previewRef,
      
      activeFormats,
      setActiveFormats,
      applyFormat,
      isFormatActive,
      
      isCustomTheme,
      currentTheme,
      
      addCustomSectionAfter,
      moveSectionUp,
      moveSectionDown,
      removeCustomSection,
      renameSection,
      updateCustomSectionContent,

      addExperienceAfter,
      removeExperience,
      moveExperienceUp,
      moveExperienceDown,
      
      addEducationAfter,
      removeEducation,
      moveEducationUp,
      moveEducationDown,
      
      addProjectAfter,
      removeProject,
      moveProjectUp,
      moveProjectDown,

      handleSingleLineKeyDown,
      
      generatePDFBlob,
      handleDownloadPDF,
      handleSaveCV
    }}>
      {children}
    </CVBuilderContext.Provider>
  );
};

export const useCVBuilder = () => {
  const context = useContext(CVBuilderContext);
  if (!context) {
    throw new Error('useCVBuilder must be used within a CVBuilderProvider');
  }
  return context;
};

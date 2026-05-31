import { 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCVBuilder } from './CVBuilderContext';
import { EditableDiv } from './EditableDiv';
import type { SectionConfig } from '../types/resume-builder.types';

export const CVPreview = () => {
  const {
    previewRef,
    fontStyle,
    layout,
    isCustomTheme,
    currentTheme,
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
    sections,
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
    
    // Actions
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
    
    handleSingleLineKeyDown
  } = useCVBuilder();

  // --- SECTIONS RENDER HELPERS ---
  
  const renderSectionTitleAndToolbar = (section: SectionConfig, isSidebar: boolean = false) => {
    return (
      <>
        {/* Section Hover Toolbar */}
        <div className="absolute right-2 -top-4 hidden group-hover/section:flex items-center gap-1 bg-slate-900/90 text-white rounded-lg p-1 shadow-md scale-75 origin-top-right transition-all z-10" onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={() => moveSectionUp(section.id)} className="hover:bg-white/20 p-1 rounded" title="Di chuyển lên"><ArrowUp size={12} /></button>
          <button onClick={() => moveSectionDown(section.id)} className="hover:bg-white/20 p-1 rounded" title="Di chuyển xuống"><ArrowDown size={12} /></button>
          <button onClick={() => addCustomSectionAfter(section.id)} className="hover:bg-white/20 p-1 text-emerald-400 hover:text-emerald-300 rounded" title="Chèn mục lớn phía sau"><Plus size={12} /></button>
          {section.isCustom && (
            <button onClick={() => removeCustomSection(section.id)} className="hover:bg-white/20 p-1 text-rose-400 hover:text-rose-300 rounded" title="Xóa mục lớn tự tạo"><Trash2 size={12} /></button>
          )}
        </div>

        <div 
          className={cn("border-b-2 pb-1", isSidebar ? "border-white/20" : (!isCustomTheme ? currentTheme.border : ''))}
          style={(!isSidebar && isCustomTheme) ? { borderColor: currentTheme.border } : undefined}
        >
          <EditableDiv
            html={section.title}
            onChange={(val) => renameSection(section.id, val)}
            onKeyDown={handleSingleLineKeyDown}
            placeholder="Tên mục..."
            className={cn("text-xs font-black uppercase tracking-widest focus:outline-none w-full", isSidebar ? "text-white" : (!isCustomTheme ? currentTheme.text : ''))}
            style={(!isSidebar && isCustomTheme) ? { color: currentTheme.text } : undefined}
          />
        </div>
      </>
    );
  };

  const renderBioSection = (section: SectionConfig) => {
    return (
      <div key={section.id} className="space-y-2 relative group/section p-2 -m-2 rounded-xl hover:bg-slate-50/20 transition-all">
        {renderSectionTitleAndToolbar(section)}
        <EditableDiv 
          html={bio}
          onChange={setBio}
          placeholder="Giới thiệu bản thân..."
          className="text-slate-600 text-xs font-medium leading-relaxed italic border-b border-transparent hover:border-slate-100 focus:border-slate-300 focus:outline-none transition-colors min-h-[30px]"
        />
      </div>
    );
  };

  const renderSkillsSection = (section: SectionConfig) => {
    const isSidebar = layout === 'modern' && section.column === 1;
    return (
      <div key={section.id} className="space-y-2 relative group/section p-2 -m-2 rounded-xl hover:bg-slate-50/20 transition-all">
        {renderSectionTitleAndToolbar(section, isSidebar)}
        <EditableDiv 
          html={skills}
          onChange={setSkills}
          placeholder="Kỹ năng chính..."
          className={cn("text-xs leading-relaxed border-b border-transparent hover:border-slate-100 focus:border-slate-300 focus:outline-none transition-colors p-1", isSidebar ? "text-slate-200" : "text-slate-600")}
        />
      </div>
    );
  };

  const renderExperienceSection = (section: SectionConfig) => {
    return (
      <div key={section.id} className="space-y-3 relative group/section p-2 -m-2 rounded-xl hover:bg-slate-50/20 transition-all">
        {renderSectionTitleAndToolbar(section)}
        <div className="space-y-4">
          {experiences.map((exp, idx) => (
            <div 
              key={idx} 
              className="space-y-1 relative group p-2 -m-2 rounded-xl hover:bg-slate-50/50 border border-transparent hover:border-dashed hover:border-slate-200 transition-all"
            >
              {/* Hover toolbar for Child Items */}
              <div className="absolute right-2 -top-3.5 hidden group-hover:flex items-center gap-1 bg-slate-900/90 text-white rounded-lg p-1 shadow-md scale-75 origin-top-right transition-all z-10">
                <button onClick={() => moveExperienceUp(idx)} className="hover:bg-white/20 p-1 rounded"><ArrowUp size={12} /></button>
                <button onClick={() => moveExperienceDown(idx)} className="hover:bg-white/20 p-1 rounded"><ArrowDown size={12} /></button>
                <button onClick={() => addExperienceAfter(idx)} className="hover:bg-white/20 p-1 rounded"><Plus size={12} /></button>
                <button onClick={() => removeExperience(idx)} className="hover:bg-white/20 p-1 text-rose-400 hover:text-rose-300 rounded"><Trash2 size={12} /></button>
              </div>

              <div className="flex justify-between items-baseline gap-4">
                <EditableDiv
                  html={exp.role}
                  onChange={(val) => {
                    const updated = [...experiences];
                    updated[idx].role = val;
                    setExperiences(updated);
                  }}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Vị trí..."
                  className="font-black text-slate-900 text-xs uppercase border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
                <EditableDiv
                  html={exp.duration}
                  onChange={(val) => {
                    const updated = [...experiences];
                    updated[idx].duration = val;
                    setExperiences(updated);
                  }}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Thời gian..."
                  className="text-[10px] text-slate-400 font-bold tracking-tight uppercase whitespace-nowrap border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
              </div>
              
              <EditableDiv
                html={exp.company}
                onChange={(val) => {
                  const updated = [...experiences];
                  updated[idx].company = val;
                  setExperiences(updated);
                }}
                onKeyDown={handleSingleLineKeyDown}
                placeholder="Tên công ty..."
                className="text-[11px] text-slate-500 font-bold uppercase tracking-tight border-b border-transparent hover:border-slate-200 focus:outline-none block w-full"
              />
              
              <EditableDiv
                html={exp.description}
                onChange={(val) => {
                  const updated = [...experiences];
                  updated[idx].description = val;
                  setExperiences(updated);
                }}
                placeholder="Mô tả công việc..."
                className="text-slate-600 text-xs font-medium leading-relaxed mt-1 focus:outline-none block w-full"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = (section: SectionConfig) => {
    return (
      <div key={section.id} className="space-y-3 relative group/section p-2 -m-2 rounded-xl hover:bg-slate-50/20 transition-all">
        {renderSectionTitleAndToolbar(section)}
        <div className="space-y-3">
          {educations.map((edu, idx) => (
            <div 
              key={idx} 
              className="space-y-1 relative group p-2 -m-2 rounded-xl hover:bg-slate-50/50 border border-transparent hover:border-dashed hover:border-slate-200 transition-all"
            >
              {/* Hover toolbar for Educations */}
              <div className="absolute right-2 -top-3.5 hidden group-hover:flex items-center gap-1 bg-slate-900/90 text-white rounded-lg p-1 shadow-md scale-75 origin-top-right transition-all z-10">
                <button onClick={() => moveEducationUp(idx)} className="hover:bg-white/20 p-1 rounded"><ArrowUp size={12} /></button>
                <button onClick={() => moveEducationDown(idx)} className="hover:bg-white/20 p-1 rounded"><ArrowDown size={12} /></button>
                <button onClick={() => addEducationAfter(idx)} className="hover:bg-white/20 p-1 rounded"><Plus size={12} /></button>
                <button onClick={() => removeEducation(idx)} className="hover:bg-white/20 p-1 text-rose-400 hover:text-rose-300 rounded"><Trash2 size={12} /></button>
              </div>

              <div className="flex justify-between items-baseline gap-4">
                <EditableDiv
                  html={edu.major}
                  onChange={(val) => {
                    const updated = [...educations];
                    updated[idx].major = val;
                    setEducations(updated);
                  }}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Chuyên ngành..."
                  className="font-black text-slate-900 text-xs uppercase border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
                <EditableDiv
                  html={edu.duration}
                  onChange={(val) => {
                    const updated = [...educations];
                    updated[idx].duration = val;
                    setEducations(updated);
                  }}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Thời gian..."
                  className="text-[10px] text-slate-400 font-bold tracking-tight uppercase whitespace-nowrap border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
              </div>
              
              <EditableDiv
                html={edu.school}
                onChange={(val) => {
                  const updated = [...educations];
                  updated[idx].school = val;
                  setEducations(updated);
                }}
                onKeyDown={handleSingleLineKeyDown}
                placeholder="Tên trường học..."
                className="text-[11px] text-slate-500 font-bold uppercase tracking-tight border-b border-transparent hover:border-slate-200 focus:outline-none block w-full"
              />
              
              <EditableDiv
                html={edu.description}
                onChange={(val) => {
                  const updated = [...educations];
                  updated[idx].description = val;
                  setEducations(updated);
                }}
                placeholder="Mô tả quá trình học tập..."
                className="text-slate-600 text-xs font-medium leading-relaxed mt-1 focus:outline-none block w-full"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = (section: SectionConfig) => {
    return (
      <div key={section.id} className="space-y-3 relative group/section p-2 -m-2 rounded-xl hover:bg-slate-50/20 transition-all">
        {renderSectionTitleAndToolbar(section)}
        <div className="space-y-3">
          {projects.map((proj, idx) => (
            <div 
              key={idx} 
              className="space-y-1 relative group p-2 -m-2 rounded-xl hover:bg-slate-50/50 border border-transparent hover:border-dashed hover:border-slate-200 transition-all"
            >
              {/* Hover toolbar for Projects */}
              <div className="absolute right-2 -top-3.5 hidden group-hover:flex items-center gap-1 bg-slate-900/90 text-white rounded-lg p-1 shadow-md scale-75 origin-top-right transition-all z-10">
                <button onClick={() => moveProjectUp(idx)} className="hover:bg-white/20 p-1 rounded"><ArrowUp size={12} /></button>
                <button onClick={() => moveProjectDown(idx)} className="hover:bg-white/20 p-1 rounded"><ArrowDown size={12} /></button>
                <button onClick={() => addProjectAfter(idx)} className="hover:bg-white/20 p-1 rounded"><Plus size={12} /></button>
                <button onClick={() => removeProject(idx)} className="hover:bg-white/20 p-1 text-rose-400 hover:text-rose-300 rounded"><Trash2 size={12} /></button>
              </div>

              <div className="flex justify-between items-baseline gap-4">
                <EditableDiv
                  html={proj.name}
                  onChange={(val) => {
                    const updated = [...projects];
                    updated[idx].name = val;
                    setProjects(updated);
                  }}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Tên dự án..."
                  className="font-black text-slate-900 text-xs uppercase border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
                <EditableDiv
                  html={proj.role}
                  onChange={(val) => {
                    const updated = [...projects];
                    updated[idx].role = val;
                    setProjects(updated);
                  }}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Vai trò..."
                  className="text-[10px] text-slate-400 font-bold tracking-tight uppercase whitespace-nowrap border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
              </div>
              
              <EditableDiv
                html={proj.tech}
                onChange={(val) => {
                  const updated = [...projects];
                  updated[idx].tech = val;
                  setProjects(updated);
                }}
                onKeyDown={handleSingleLineKeyDown}
                placeholder="Công nghệ sử dụng..."
                className="text-[10px] text-slate-500 font-bold uppercase tracking-tight border-b border-transparent hover:border-slate-200 focus:outline-none block w-full"
              />
              
              <EditableDiv
                html={proj.description}
                onChange={(val) => {
                  const updated = [...projects];
                  updated[idx].description = val;
                  setProjects(updated);
                }}
                placeholder="Mô tả chi tiết dự án..."
                className="text-slate-600 text-xs font-medium leading-relaxed mt-1 focus:outline-none block w-full"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomSection = (section: SectionConfig) => {
    const isSidebar = layout === 'modern' && section.column === 1;
    return (
      <div key={section.id} className="space-y-2 relative group/section p-2 -m-2 rounded-xl hover:bg-slate-50/20 transition-all">
        {renderSectionTitleAndToolbar(section, isSidebar)}
        <EditableDiv 
          html={section.content || ''}
          onChange={(val) => updateCustomSectionContent(section.id, val)}
          placeholder="Nhấp đúp hoặc click để bắt đầu nhập nội dung cho mục lớn..."
          className={cn("text-xs font-medium leading-relaxed border-b border-transparent hover:border-slate-100 focus:outline-none focus:border-slate-300 transition-colors min-h-[35px] p-1", isSidebar ? "text-slate-200" : "text-slate-600")}
        />
      </div>
    );
  };

  const renderSection = (section: SectionConfig) => {
    if (!section.visible) return null;
    switch (section.id) {
      case 'bio':
        return renderBioSection(section);
      case 'skills':
        return renderSkillsSection(section);
      case 'experience':
        return renderExperienceSection(section);
      case 'education':
        return renderEducationSection(section);
      case 'projects':
        return renderProjectsSection(section);
      default:
        if (section.isCustom) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  return (
    <div 
      ref={previewRef}
      id="cv-preview-container"
      className={cn(
        "bg-white w-[210mm] min-h-[297mm] shadow-2xl p-0 overflow-hidden relative text-slate-800 text-[13px] leading-relaxed select-text",
        fontStyle
      )}
      style={{ minHeight: '297mm', width: '210mm' }}
    >
      
      {/* LAYOUT 1: MODERN TWO-COLUMN LAYOUT */}
      {layout === 'modern' && (
        <div className="grid grid-cols-12 min-h-[297mm]">
          
          {/* Left Column (Sidebar) */}
          <div 
            className={cn("col-span-4 p-8 text-white flex flex-col justify-between", !isCustomTheme ? currentTheme.sidebarBg : '')}
            style={isCustomTheme ? { backgroundColor: currentTheme.sidebarBg } : undefined}
          >
            <div>
              {/* Name / Title */}
              <div className="mb-8">
                <EditableDiv
                  html={fullName}
                  onChange={setFullName}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Họ và Tên"
                  className="text-xl font-black uppercase tracking-wide leading-tight break-words border-b border-transparent hover:border-white/20 focus:border-white/50 focus:outline-none transition-colors w-full"
                />
                <EditableDiv
                  html={targetJobTitle}
                  onChange={setTargetJobTitle}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Vị trí ứng tuyển"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-2 border-b border-transparent hover:border-white/20 focus:border-white/50 focus:outline-none transition-colors w-full"
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="border-b border-white/10 pb-1.5 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Liên hệ</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <Mail size={12} className="shrink-0 text-slate-300" />
                  <EditableDiv
                    html={email}
                    onChange={setEmail}
                    onKeyDown={handleSingleLineKeyDown}
                    placeholder="Email"
                    className="break-all font-medium border-b border-transparent hover:border-white/20 focus:border-white/50 focus:outline-none transition-colors w-full"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Phone size={12} className="shrink-0 text-slate-300" />
                  <EditableDiv
                    html={phone}
                    onChange={setPhone}
                    onKeyDown={handleSingleLineKeyDown}
                    placeholder="Số điện thoại"
                    className="font-medium border-b border-transparent hover:border-white/20 focus:border-white/50 focus:outline-none transition-colors w-full"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <MapPin size={12} className="shrink-0 text-slate-300" />
                  <EditableDiv
                    html={address}
                    onChange={setAddress}
                    onKeyDown={handleSingleLineKeyDown}
                    placeholder="Địa chỉ"
                    className="break-words font-medium border-b border-transparent hover:border-white/20 focus:border-white/50 focus:outline-none transition-colors w-full"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <ExternalLink size={12} className="shrink-0 text-slate-300" />
                  <EditableDiv
                    html={website}
                    onChange={setWebsite}
                    onKeyDown={handleSingleLineKeyDown}
                    placeholder="Website/GitHub"
                    className="break-all font-medium border-b border-transparent hover:border-white/20 focus:border-white/50 focus:outline-none transition-colors w-full"
                  />
                </div>
              </div>

              {/* Sections in Left Column (column === 1) */}
              {sections
                .filter(s => s.column === 1)
                .map(renderSection)}
            </div>

            <div className="text-[9px] text-white/30 text-center font-bold tracking-wide mt-8">
              SmartCV Builder
            </div>
          </div>

          {/* Right Column (Main content) */}
          <div className="col-span-8 p-10 flex flex-col gap-6">
            {/* Render sections sequentially (where column !== 1) */}
            {sections
              .filter(s => s.column !== 1)
              .map(renderSection)}
          </div>
        </div>
      )}

      {/* LAYOUT 2: CLASSIC SINGLE COLUMN LAYOUT */}
      {layout === 'classic' && (
        <div className="p-12 min-h-[297mm] flex flex-col gap-6">
          
          {/* Top Header Block */}
          <div className="text-center space-y-2 border-b-2 border-slate-200 pb-6">
            <EditableDiv
              html={fullName}
              onChange={setFullName}
              onKeyDown={handleSingleLineKeyDown}
              placeholder="Họ và Tên"
              className={cn("text-2xl font-black uppercase tracking-wide border-b border-transparent hover:border-slate-200 focus:outline-none focus:border-slate-400 transition-colors inline-block", !isCustomTheme ? currentTheme.text : '')}
              style={isCustomTheme ? { color: currentTheme.text } : undefined}
            />
            
            <EditableDiv
              html={targetJobTitle}
              onChange={setTargetJobTitle}
              onKeyDown={handleSingleLineKeyDown}
              placeholder="Vị trí ứng tuyển"
              className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-transparent hover:border-slate-200 focus:outline-none transition-colors w-full text-center"
            />
            
            {/* Contact Info (Inline list) */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Mail size={12} /> 
                <EditableDiv
                  html={email}
                  onChange={setEmail}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Email"
                  className="border-b border-transparent hover:border-slate-300 focus:outline-none inline-block min-w-[100px]"
                />
              </span>
              
              <span className="flex items-center gap-1">
                <Phone size={12} /> 
                <EditableDiv
                  html={phone}
                  onChange={setPhone}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Số điện thoại"
                  className="border-b border-transparent hover:border-slate-300 focus:outline-none inline-block min-w-[100px]"
                />
              </span>
              
              <span className="flex items-center gap-1">
                <MapPin size={12} /> 
                <EditableDiv
                  html={address}
                  onChange={setAddress}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Địa chỉ"
                  className="border-b border-transparent hover:border-slate-300 focus:outline-none inline-block min-w-[100px]"
                />
              </span>
              
              <span className="flex items-center gap-1">
                <ExternalLink size={12} /> 
                <EditableDiv
                  html={website}
                  onChange={setWebsite}
                  onKeyDown={handleSingleLineKeyDown}
                  placeholder="Website/GitHub"
                  className="border-b border-transparent hover:border-slate-300 focus:outline-none inline-block min-w-[100px]"
                />
              </span>
            </div>
          </div>

          {/* Render sections sequentially (all sections in single column classic layout) */}
          {sections.map(renderSection)}

        </div>
      )}

    </div>
  );
};
export default CVPreview;

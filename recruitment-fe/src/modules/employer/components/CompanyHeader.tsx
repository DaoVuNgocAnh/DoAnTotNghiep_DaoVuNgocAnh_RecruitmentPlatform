import { Camera, Edit, Loader2, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CompanyHeaderProps {
  company: any;
  user: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadCoverMutation: any;
  uploadLogoMutation: any;
}

export const CompanyHeader = ({
  company,
  user,
  isEditing,
  setIsEditing,
  coverInputRef,
  fileInputRef,
  handleCoverChange,
  handleFileChange,
  uploadCoverMutation,
  uploadLogoMutation,
}: CompanyHeaderProps) => {
  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 h-64 md:h-80 shadow-xl">
      <img 
        src={company.coverUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"} 
        className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        alt="Company Cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      
      {user?.isOwner && (
        <div className="absolute top-6 right-6">
           <Button 
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadCoverMutation.isPending}
            className="rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 font-black uppercase tracking-widest text-[10px] h-10 px-6"
           >
             {uploadCoverMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Camera className="mr-2" size={16} />} 
             Thay đổi ảnh bìa
           </Button>
           <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
        </div>
      )}

      <div className="absolute bottom-8 left-10 right-10 flex flex-col md:flex-row items-end gap-6">
          <div className="group/logo relative shrink-0">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] border-[6px] border-white/10 shadow-2xl bg-white/10 backdrop-blur-xl">
              <AvatarImage src={company.logoUrl || undefined} className="object-contain p-4" />
              <AvatarFallback className="rounded-[2rem] bg-white text-3xl font-black text-[#00b14f]">
                {company.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {user?.isOwner && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLogoMutation.isPending}
                className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-black/40 opacity-0 transition-opacity group-hover/logo:opacity-100 backdrop-blur-[2px]"
              >
                {uploadLogoMutation.isPending ? (
                  <Loader2 className="animate-spin text-white" />
                ) : (
                  <Camera className="text-white" size={28} />
                )}
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="flex-1 pb-2">
             <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-[#00b14f] text-white border-none px-3 py-1 font-black text-[9px] uppercase rounded-full">
                   Verified Business
                </Badge>
                {company.isPremium && (
                  <Badge className="bg-amber-400 text-amber-900 border-none px-3 py-1 font-black text-[9px] uppercase rounded-full">
                     Premium Partner
                  </Badge>
                )}
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none mb-3">
                {company.name}
             </h1>
             <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                <MapPin size={12} className="text-[#00b14f]" /> {company.location || "Chưa cập nhật địa điểm"}
             </p>
          </div>

          <div className="flex gap-3 pb-2">
             {!isEditing && user?.isOwner && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="rounded-2xl bg-[#00b14f] hover:bg-[#009643] font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-green-900/40"
                >
                  <Edit size={14} className="mr-2" /> Chỉnh sửa hồ sơ
                </Button>
             )}
          </div>
      </div>
    </div>
  );
};

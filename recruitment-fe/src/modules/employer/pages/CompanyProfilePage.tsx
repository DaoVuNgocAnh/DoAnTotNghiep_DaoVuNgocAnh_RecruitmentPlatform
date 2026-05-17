import { Loader2 } from 'lucide-react';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import { CompanyHeader } from '../components/CompanyHeader';
import { CompanyAbout } from '../components/CompanyAbout';
import { CompanyQuickInfo } from '../components/CompanyQuickInfo';

export const CompanyProfilePage = () => {
  const {
    user,
    company,
    isLoading,
    isEditing,
    setIsEditing,
    fileInputRef,
    coverInputRef,
    form,
    onSubmit,
    handleFileChange,
    handleCoverChange,
    uploadLogoMutation,
    uploadCoverMutation,
  } = useCompanyProfile();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#00b14f]" size={40} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center text-sm font-bold text-slate-400">
        Không tìm thấy hồ sơ doanh nghiệp.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <CompanyHeader
        company={company}
        user={user}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        coverInputRef={coverInputRef}
        fileInputRef={fileInputRef}
        handleCoverChange={handleCoverChange}
        handleFileChange={handleFileChange}
        uploadCoverMutation={uploadCoverMutation}
        uploadLogoMutation={uploadLogoMutation}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_0.4fr]">
        <CompanyAbout
          company={company}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          form={form}
          onSubmit={onSubmit}
        />
        <CompanyQuickInfo company={company} />
      </div>
    </div>
  );
};

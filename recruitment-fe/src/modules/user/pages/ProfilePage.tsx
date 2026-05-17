import { Loader2 } from 'lucide-react';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useProfile } from '../hooks/useProfile';
import { ProfileSummary } from '../components/ProfileSummary';
import { ProfileForm } from '../components/ProfileForm';

export const ProfilePage = () => {
  useFlashMessage();
  const {
    user,
    isLoading,
    isEditing,
    setIsEditing,
    fileInputRef,
    form,
    onSubmit,
    handleAvatarChange,
    updateAvatarMutation,
    updateProfileMutation,
  } = useProfile();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ProfileSummary
            user={user}
            fileInputRef={fileInputRef}
            handleAvatarChange={handleAvatarChange}
            updateAvatarMutation={updateAvatarMutation}
          />
          <ProfileForm
            form={form}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSubmit={onSubmit}
            updateProfileMutation={updateProfileMutation}
          />
        </div>
      </div>
    </div>
  );
};

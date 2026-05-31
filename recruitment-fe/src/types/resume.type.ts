export interface Resume {
  id: string;
  resumeName: string;
  fileUrl: string;
  isDefault: boolean;
  uploadedAt: string;
  isDraft?: boolean;
  draftData?: string | null;
}

export type TargetType = 'JOB' | 'CANDIDATE';

export interface SavedItem {
  id: string;
  userId: string;
  companyId?: string | null;
  targetId: string;
  targetType: TargetType;
  scope?: 'PERSONAL' | 'COMPANY';
  createdAt: string;
  note?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  details: any; // Can be Job or User details
}

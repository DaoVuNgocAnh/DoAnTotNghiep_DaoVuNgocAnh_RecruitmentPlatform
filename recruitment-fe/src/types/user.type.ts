import { Role } from './role';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'LOCKED';
  companyId?: string;
  bio?: string;
  dateOfBirth?: string;
  skills?: string;
  createdAt: string;
  isOwner?: boolean;
  isPremium?: boolean;
  companyStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'BLACKLIST';
  resumes?: Array<{
    id: string;
    resumeName: string;
    fileUrl: string;
    jobTitle?: string;
    applyDate: string;
  }>;
  pendingJoinRequest?: {
    id: string;
    companyId: string;
    companyName: string;
    taxCode: string;
  } | null;
}

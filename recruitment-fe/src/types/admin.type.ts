import { Role } from "./role";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'LOCKED';
  avatarUrl?: string | null;
  phone?: string | null;
  companyId?: string | null;
  createdAt: string;
  company?: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export interface AdminStats {
  users: {
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
  };
  companies: {
    total: number;
    byStatus: Record<string, number>;
  };
  jobs: {
    total: number;
    byStatus: Record<string, number>;
  };
}

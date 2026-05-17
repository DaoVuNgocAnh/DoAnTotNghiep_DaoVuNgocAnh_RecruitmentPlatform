export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  coverUrl?: string;
  location?: string;
  taxCode: string;
  description: string;
  websiteUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'BLACKLIST';
  isPremium: boolean;
  ownerId: string;
  createdAt: string;
  _count?: {
    jobs: number;
  };
  jobs?: any[];
}

export interface CreateCompanyDto {
  name: string;
  taxCode: string;
  description: string;
  websiteUrl?: string;
  logoUrl?: string;
  location?: string;
}

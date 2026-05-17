export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  _count?: { jobs: number };
}

export interface JobAssignee {
  id: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirement: string;
  requiredExperience?: string;
  salaryMin?: number;
  salaryMax?: number;
  isSalaryNegotiable: boolean;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'REMOTE';
  location: string;
  status: 'PENDING' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  viewCount: number;
  expiredDate?: string; 
  isFeatured: boolean;
  companyId: string;
  categoryId: string;
  category: JobCategory;
  company: { id: string; name: string; logoUrl?: string; isPremium?: boolean; };
  assignees?: JobAssignee[];
  createdAt: string;
}

export interface CreateJobDto {
  categoryId: string;
  title: string;
  description: string;
  requirement: string;
  requiredExperience?: string;
  salaryMin?: number;
  salaryMax?: number;
  isSalaryNegotiable?: boolean;
  jobType?: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'REMOTE';
  location: string;
  expiredDate?: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  status?: 'PENDING' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
}

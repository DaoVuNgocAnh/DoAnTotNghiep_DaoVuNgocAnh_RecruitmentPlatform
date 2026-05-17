import apiClient from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

import type { PaginatedResponse } from "@/types/pagination";

export const jobApi = {
  getCategories: () => apiClient.get<PaginatedResponse<JobCategory>>("/job-categories"),
  createJob: (data: CreateJobDto) => apiClient.post<Job>("/jobs", data),
  updateJob: (id: string, data: UpdateJobDto) => apiClient.patch<Job>(`/jobs/${id}`, data),
  getAllJobs: (params?: { 
    categoryId?: string; 
    companyId?: string;
    search?: string; 
    location?: string; 
    jobType?: string;
    salaryMin?: number;
    salaryMax?: number;
    isSalaryNegotiable?: boolean;
    sortBy?: string; 
    page?: number; 
    limit?: number 
  }) => 
    apiClient.get<PaginatedResponse<Job>>("/jobs", { params }),
  getJobById: (id: string) => apiClient.get<Job>(`/jobs/${id}`),

  // ADMIN APIs
  getAdminJobs: (params?: { status?: string; page?: number; limit?: number }) => 
    apiClient.get<PaginatedResponse<Job>>("/jobs/admin/all", { params }),
  updateJobStatusAdmin: (id: string, status: string) => apiClient.patch(`/jobs/${id}/status/admin`, { status }),
  getTrendingJobs: () => apiClient.get<Job[]>("/jobs/trending"),

  // EMPLOYER APIs
  getMyJobs: (params?: { page?: number; limit?: number }) => 
    apiClient.get<PaginatedResponse<Job>>("/jobs/my-jobs", { params }),
  closeJob: (id: string) => apiClient.patch(`/jobs/${id}/close`),
  getRecommendedJobs: () => apiClient.get<Job[]>("/jobs/recommended"),
};

// --- HOOKS ---
export const useJobCategories = () => useQuery({
  queryKey: ['job-categories'],
  queryFn: () => jobApi.getCategories().then((res) => res.data.data),
});

export const useRecommendedJobs = () => useQuery({
  queryKey: ['jobs-recommended'],
  queryFn: () => jobApi.getRecommendedJobs().then((res) => res.data),
});

export const useAllJobs = (params?: { 
  categoryId?: string; 
  companyId?: string;
  search?: string; 
  location?: string; 
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  isSalaryNegotiable?: boolean;
  sortBy?: string; 
  page?: number; 
  limit?: number 
}) => useQuery({
  queryKey: ['jobs', params],
  queryFn: () => jobApi.getAllJobs(params).then((res) => res.data),
});

export const useJobDetail = (id: string) => useQuery({
  queryKey: ['job', id],
  queryFn: () => jobApi.getJobById(id).then((res) => res.data),
  enabled: !!id,
});

export const useMyJobs = (params?: { page?: number; limit?: number }) => useQuery({
  queryKey: ['my-jobs', params],
  queryFn: () => jobApi.getMyJobs(params).then((res) => res.data),
});

export const useAdminJobs = (params?: { status?: string; page?: number; limit?: number }) => useQuery({
  queryKey: ['admin-jobs', params],
  queryFn: () => jobApi.getAdminJobs(params).then((res) => res.data),
});

export const useTrendingJobs = () => useQuery({
  queryKey: ['jobs-trending'],
  queryFn: () => jobApi.getTrendingJobs().then((res) => res.data),
});

export const useLatestJobs = (limit: number = 6) => useQuery({
  queryKey: ['jobs-latest', limit],
  queryFn: () => jobApi.getAllJobs({ sortBy: 'createdAt', limit, page: 1 }).then((res) => res.data),
});

export const useRecommendedJobsCandidate = () => {
  return useQuery({
    queryKey: ['jobs-recommended'],
    queryFn: () => jobApi.getRecommendedJobs().then(res => res.data),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobApi.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
};

import apiClient from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirement: string;
  salary: string;
  location: string;
  status: 'PENDING' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  viewCount: number;
  expiredDate?: string; // Bổ sung
  companyId: string;
  categoryId: string;
  category: JobCategory;
  company: { name: string; logoUrl?: string; };
  createdAt: string;
}

export const jobApi = {
  getCategories: () => apiClient.get<JobCategory[]>("/job-categories"),
  createJob: (data: any) => apiClient.post("/jobs", data),
  getAllJobs: (params?: { categoryId?: string; search?: string }) => 
    apiClient.get<Job[]>("/jobs", { params }),
  getJobById: (id: string) => apiClient.get<Job>(`/jobs/${id}`),

  // ADMIN APIs
  getAdminJobs: (status?: string) => apiClient.get<Job[]>("/jobs/admin/all", { params: { status } }),
  updateJobStatusAdmin: (id: string, status: string) => apiClient.patch(`/jobs/${id}/status/admin`, { status }),

  // EMPLOYER APIs
  getMyJobs: () => apiClient.get<Job[]>("/jobs/my-jobs"),
  closeJob: (id: string) => apiClient.patch(`/jobs/${id}/close`),
};

// --- HOOKS ---
export const useJobCategories = () => useQuery({
  queryKey: ['job-categories'],
  queryFn: () => jobApi.getCategories().then((res) => res.data),
});

export const useAllJobs = (params?: { categoryId?: string; search?: string }) => useQuery({
  queryKey: ['jobs', params],
  queryFn: () => jobApi.getAllJobs(params).then((res) => res.data),
});

export const useJobDetail = (id: string) => useQuery({
  queryKey: ['job', id],
  queryFn: () => jobApi.getJobById(id).then((res) => res.data),
  enabled: !!id,
});

export const useMyJobs = () => useQuery({
  queryKey: ['my-jobs'],
  queryFn: () => jobApi.getMyJobs().then((res) => res.data),
});

export const useAdminJobs = (status?: string) => useQuery({
  queryKey: ['admin-jobs', status],
  queryFn: () => jobApi.getAdminJobs(status).then((res) => res.data),
});

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobApi.createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
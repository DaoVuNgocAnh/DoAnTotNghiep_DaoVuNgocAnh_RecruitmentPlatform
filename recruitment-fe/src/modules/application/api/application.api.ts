import apiClient from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/types/pagination";

export interface ApplicationActor {
  id: string;
  fullName: string;
  email: string;
}

export interface ApplicationHistory {
  id: string;
  oldStatus?: string | null;
  newStatus: string;
  note?: string | null;
  createdAt: string;
  actor: ApplicationActor;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  resumeId: string;
  applyDate: string;
  status: 'PENDING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED' | 'WITHDRAWN' | 'REVIEWING';
  employerNote?: string;
  job: {
    title: string;
    company: {
      name: string;
      logoUrl?: string;
    };
  };
  resume: {
    resumeName: string;
    fileUrl: string;
  };
  candidate?: {
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export const applicationApi = {
  applyJob: (data: { jobId: string; resumeId: string }) => apiClient.post<Application>("/applications", data),
  getMyApplications: (params?: { page?: number; limit?: number }) => 
    apiClient.get<PaginatedResponse<Application>>("/applications/my-applications", { params }),
  getEmployerApplications: (params?: { page?: number; limit?: number }) => 
    apiClient.get<PaginatedResponse<Application>>("/applications/employer", { params }),
  updateStatus: (id: string, data: { status: string; employerNote?: string }) => 
    apiClient.patch<Application>(`/applications/${id}/status`, data),
};

// --- HOOKS ---
export const useMyApplications = (params?: { page?: number; limit?: number }) => useQuery({
  queryKey: ['my-applications', params],
  queryFn: () => applicationApi.getMyApplications(params).then(res => res.data),
});

export const useEmployerApplications = (params?: { page?: number; limit?: number }) => useQuery({
  queryKey: ['employer-applications', params],
  queryFn: () => applicationApi.getEmployerApplications(params).then(res => res.data),
});

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.applyJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-applications'] }),
  });
};

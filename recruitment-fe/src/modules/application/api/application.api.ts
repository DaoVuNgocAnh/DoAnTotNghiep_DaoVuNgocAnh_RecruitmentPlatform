import apiClient from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/types/pagination";
import type { Application } from "@/types/application.type";

export const applicationApi = {
  applyJob: (data: { jobId: string; resumeId: string; candidateNote?: string }) => apiClient.post<Application>("/applications", data),
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

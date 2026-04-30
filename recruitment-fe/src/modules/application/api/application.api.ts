import apiClient from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const applicationApi = {
  applyJob: (data: { jobId: string; resumeId: string }) => apiClient.post("/applications", data),
  getMyApplications: () => apiClient.get("/applications/my-applications"),
  getEmployerApplications: () => apiClient.get("/applications/employer"),
  updateStatus: (id: string, data: { status: string; employerNote?: string }) => 
    apiClient.patch(`/applications/${id}/status`, data),
};

// --- HOOKS ---
export const useMyApplications = () => useQuery({
  queryKey: ['my-applications'],
  queryFn: () => applicationApi.getMyApplications().then(res => res.data),
});

export const useEmployerApplications = () => useQuery({
  queryKey: ['employer-applications'],
  queryFn: () => applicationApi.getEmployerApplications().then(res => res.data),
});

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.applyJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-applications'] }),
  });
};
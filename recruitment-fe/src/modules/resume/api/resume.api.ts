import apiClient from "@/api/axiosClient";
import type { PaginatedResponse } from "@/types/pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Resume } from "@/types/resume.type";

export const resumeApi = {
  getMyResumes: (params?: { page?: number; limit?: number }) => 
    apiClient.get<PaginatedResponse<Resume>>("/resumes/my", { params }),
  
  uploadResume: (formData: FormData) => apiClient.post("/resumes/upload", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  setDefault: (id: string) => apiClient.patch(`/resumes/${id}/default`),
  
  deleteResume: (id: string) => apiClient.delete(`/resumes/${id}`),
};

// --- HOOKS ---

export const useResumes = (params?: { page?: number; limit?: number }, enabled: boolean = true) => useQuery({
  queryKey: ['resumes', params?.page, params?.limit],
  queryFn: () => resumeApi.getMyResumes(params).then(res => res.data),
  enabled,
});

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resumeApi.uploadResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
};

export const useSetDefaultResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resumeApi.setDefault,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resumeApi.deleteResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
};

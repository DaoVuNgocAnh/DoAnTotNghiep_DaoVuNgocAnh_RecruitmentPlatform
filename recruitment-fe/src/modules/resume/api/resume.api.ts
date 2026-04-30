import apiClient from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Resume {
  id: string;
  resumeName: string;
  fileUrl: string;
  isDefault: boolean;
  uploadedAt: string;
}

export const resumeApi = {
  getMyResumes: () => apiClient.get<Resume[]>("/resumes/my"),
  
  uploadResume: (formData: FormData) => apiClient.post("/resumes/upload", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  setDefault: (id: string) => apiClient.patch(`/resumes/${id}/default`),
  
  deleteResume: (id: string) => apiClient.delete(`/resumes/${id}`),
};

// --- HOOKS ---

export const useResumes = () => useQuery({
  queryKey: ['resumes'],
  queryFn: () => resumeApi.getMyResumes().then(res => res.data),
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
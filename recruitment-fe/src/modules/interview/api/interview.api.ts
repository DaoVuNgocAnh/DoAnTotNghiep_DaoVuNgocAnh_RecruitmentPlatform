import apiClient from "@/api/axiosClient";
import type { PaginatedResponse } from "@/types/pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { 
  Interview, 
  CreateInterviewDto 
} from "@/types/interview.type";
import { InterviewStatus } from "@/types/interview.type";

export type { Interview, CreateInterviewDto };
export { InterviewStatus };

export const interviewApi = {
  create: (dto: CreateInterviewDto) => apiClient.post("/interviews", dto),
  
  getEmployerInterviews: (params?: { page?: number; limit?: number }) => 
    apiClient.get<PaginatedResponse<Interview>>("/interviews/employer", { params }),
  
  getMyInterviews: (params?: { page?: number; limit?: number }) => 
    apiClient.get<PaginatedResponse<Interview>>("/interviews/my-interviews", { params }),
  
  updateStatus: (id: string, status: InterviewStatus) => 
    apiClient.patch(`/interviews/${id}/status`, { status }),
};

// --- HOOKS ---

export const useEmployerInterviews = (params?: { page?: number; limit?: number }) => useQuery({
  queryKey: ['interviews', 'employer', params?.page, params?.limit],
  queryFn: () => interviewApi.getEmployerInterviews(params).then(res => res.data),
});

export const useMyInterviews = (params?: { page?: number; limit?: number }) => useQuery({
  queryKey: ['interviews', 'candidate', params?.page, params?.limit],
  queryFn: () => interviewApi.getMyInterviews(params).then(res => res.data),
});

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
    },
  });
};

export const useUpdateInterviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: InterviewStatus }) => 
      interviewApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
};

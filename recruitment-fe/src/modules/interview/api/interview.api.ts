import apiClient from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export enum InterviewStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED'
}

export interface Interview {
  id: string;
  applicationId: string;
  interviewDate: string;
  location: string;
  status: InterviewStatus;
  responseDate?: string;
  application: {
    candidate?: {
      fullName: string;
      email: string;
      phone: string;
    };
    job: {
      title: string;
      company?: {
        name: string;
        logoUrl: string;
      }
    };
  };
}

export interface CreateInterviewDto {
  applicationId: string;
  interviewDate: string;
  location: string;
}

export const interviewApi = {
  create: (dto: CreateInterviewDto) => apiClient.post("/interviews", dto),
  
  getEmployerInterviews: () => apiClient.get<Interview[]>("/interviews/employer"),
  
  getMyInterviews: () => apiClient.get<Interview[]>("/interviews/my-interviews"),
  
  updateStatus: (id: string, status: InterviewStatus) => 
    apiClient.patch(`/interviews/${id}/status`, { status }),
};

// --- HOOKS ---

export const useEmployerInterviews = () => useQuery({
  queryKey: ['interviews', 'employer'],
  queryFn: () => interviewApi.getEmployerInterviews().then(res => res.data),
});

export const useMyInterviews = () => useQuery({
  queryKey: ['interviews', 'candidate'],
  queryFn: () => interviewApi.getMyInterviews().then(res => res.data),
});

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
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

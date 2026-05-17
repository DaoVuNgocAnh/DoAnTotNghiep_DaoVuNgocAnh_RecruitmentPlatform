import axiosClient from '@/api/axiosClient';
import type { PaginatedResponse } from '@/types/pagination';
import type { 
  Feedback, 
  FeedbackStatus, 
  FeedbackType, 
  CreateFeedbackPayload 
} from '@/types/feedback.type';

export type { Feedback, FeedbackStatus, FeedbackType, CreateFeedbackPayload };

export const feedbackApi = {
  create: (payload: CreateFeedbackPayload) =>
    axiosClient.post<Feedback>('/feedback', payload),

  getAll: (params?: {
    status?: FeedbackStatus | 'ALL';
    type?: FeedbackType | 'ALL';
    page?: number;
    limit?: number;
  }) =>
    axiosClient.get<PaginatedResponse<Feedback>>('/feedback', {
      params: {
        status: params?.status === 'ALL' ? undefined : params?.status,
        type: params?.type === 'ALL' ? undefined : params?.type,
        page: params?.page,
        limit: params?.limit,
      },
    }),

  updateStatus: (id: string, status: FeedbackStatus) =>
    axiosClient.patch<Feedback>(`/feedback/${id}/status`, { status }),
};

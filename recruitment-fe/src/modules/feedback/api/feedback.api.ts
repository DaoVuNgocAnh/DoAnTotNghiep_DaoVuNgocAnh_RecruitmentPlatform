import axiosClient from '@/api/axiosClient';
import type { PaginatedResponse } from '@/types/pagination';

export type FeedbackType = 'BUG' | 'SUGGESTION' | 'QUESTION' | 'OTHER';
export type FeedbackStatus = 'NEW' | 'REVIEWING' | 'RESOLVED';

export interface Feedback {
  id: string;
  userId?: string | null;
  type: FeedbackType;
  title: string;
  content: string;
  pageUrl?: string | null;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
  } | null;
}

export interface CreateFeedbackPayload {
  type: FeedbackType;
  title: string;
  content: string;
  pageUrl?: string;
}

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

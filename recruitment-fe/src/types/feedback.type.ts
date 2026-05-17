import { Role } from "./role";

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
    role: Role;
  } | null;
}

export interface CreateFeedbackPayload {
  type: FeedbackType;
  title: string;
  content: string;
  pageUrl?: string;
}

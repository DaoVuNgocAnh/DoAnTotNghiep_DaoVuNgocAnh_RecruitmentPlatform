import axiosClient from "@/api/axiosClient";
import type { PaginatedResponse } from "@/types/pagination";

export type TargetType = 'JOB' | 'CANDIDATE';

export interface SavedItem {
  id: string;
  userId: string;
  companyId?: string | null;
  targetId: string;
  targetType: TargetType;
  scope?: 'PERSONAL' | 'COMPANY';
  createdAt: string;
  note?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  details: any; // Can be Job or User details
}

export const savedItemsApi = {
  toggle: async (data: { targetId: string; targetType: TargetType }) => {
    const response = await axiosClient.post("/saved-items/toggle", data);
    return response.data;
  },

  updateNote: async (itemId: string, note: string) => {
    const response = await axiosClient.patch(`/saved-items/${itemId}/note`, { note });
    return response.data;
  },

  updateCompanyNote: async (itemId: string, note: string) => {
    const response = await axiosClient.patch(`/saved-items/company/candidates/${itemId}/note`, { note });
    return response.data;
  },

  getAll: async (params?: { type?: TargetType; page?: number; limit?: number }): Promise<PaginatedResponse<SavedItem>> => {
    const response = await axiosClient.get("/saved-items", {
      params,
    });
    return response.data;
  },

  checkStatus: async (targetId: string): Promise<{ isSaved: boolean }> => {
    const response = await axiosClient.get(`/saved-items/check/${targetId}`);
    return response.data;
  },

  getCompanyCandidates: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<SavedItem>> => {
    const response = await axiosClient.get("/saved-items/company/candidates", { params });
    return response.data;
  },

  toggleCompanyCandidate: async (candidateId: string) => {
    const response = await axiosClient.post(`/saved-items/company/candidates/toggle/${candidateId}`);
    return response.data;
  },

  checkCompanyCandidate: async (candidateId: string): Promise<{ isSaved: boolean }> => {
    const response = await axiosClient.get(`/saved-items/company/candidates/check/${candidateId}`);
    return response.data;
  },
};

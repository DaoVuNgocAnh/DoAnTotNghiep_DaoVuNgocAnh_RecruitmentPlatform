import axiosClient from "@/api/axiosClient";

export type TargetType = 'JOB' | 'CANDIDATE';

export interface SavedItem {
  id: string;
  userId: string;
  targetId: string;
  targetType: TargetType;
  createdAt: string;
  note?: string;
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

  getAll: async (type?: TargetType): Promise<SavedItem[]> => {
    const response = await axiosClient.get("/saved-items", {
      params: { type },
    });
    return response.data;
  },

  checkStatus: async (targetId: string): Promise<{ isSaved: boolean }> => {
    const response = await axiosClient.get(`/saved-items/check/${targetId}`);
    return response.data;
  },
};

import axiosClient from "@/api/axiosClient";
import type { Notification } from "../types/notification.type";
import type { PaginatedResponse } from "@/types/pagination";

export const notificationApi = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Notification>> => {
    const response = await axiosClient.get("/notifications", { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosClient.get("/notifications/unread-count");
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await axiosClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await axiosClient.patch("/notifications/read-all");
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/notifications/${id}`);
  },
};

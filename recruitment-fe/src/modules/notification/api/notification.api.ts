import axiosClient from "@/api/axiosClient";
import type { Notification } from "../types/notification.type";

export const notificationApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await axiosClient.get("/notifications");
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

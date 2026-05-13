import apiClient from "@/api/axiosClient";

export const newsletterApi = {
  subscribe: (email: string) => apiClient.post("/newsletter/subscribe", { email }),
};

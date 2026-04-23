import axiosClient from "@/api/axiosClient";

export const userApi = {
  getMe: () => axiosClient.get("/users/me"),

  updateProfile: (data: any) => axiosClient.patch("/users/profile", data),
};
import axiosClient from "@/api/axiosClient";

export const adminApi = {
  // Lấy danh sách công ty (có filter)
  getCompanies: (params?: { status?: string; search?: string }) => 
    axiosClient.get("/companies/admin/all", { params }),

  // Cập nhật trạng thái công ty
  updateCompanyStatus: (companyId: string, status: string) => 
    axiosClient.patch(`/companies/${companyId}/status`, { status }),
};
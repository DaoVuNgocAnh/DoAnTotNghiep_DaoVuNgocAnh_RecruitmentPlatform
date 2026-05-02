import axiosClient from "@/api/axiosClient";

export const companyApi = {
  getCompanies: (params?: { search?: string }) => 
    axiosClient.get("/companies", { params }),
    
  getCompanyById: (id: string) => 
    axiosClient.get(`/companies/${id}/public`),
};

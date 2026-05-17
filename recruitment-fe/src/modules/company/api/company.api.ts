import axiosClient from "@/api/axiosClient";
import type { PaginatedResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import type { Company, CreateCompanyDto } from "@/types/company.type";

export type { Company, CreateCompanyDto };

export const companyApi = {
  getCompanies: (params?: { search?: string; status?: string; page?: number; limit?: number }) => 
    axiosClient.get<PaginatedResponse<Company>>("/companies", { params }),
    
  getCompanyById: (id: string) => 
    axiosClient.get<Company>(`/companies/${id}/public`),

  updateMyCompany: (data: Partial<Company>) =>
    axiosClient.patch<Company>("/companies/my-company", data),

  uploadCompanyLogo: (file: File) => {
    const formData = new FormData();
    formData.append("logo", file);
    return axiosClient.patch<Company>("/companies/my-company/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadCompanyCover: (file: File) => {
    const formData = new FormData();
    formData.append("cover", file);
    return axiosClient.patch<Company>("/companies/my-company/cover", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export const useCompanies = (params?: { search?: string; status?: string; page?: number; limit?: number }) => useQuery({
  queryKey: ['public-companies', params],
  queryFn: () => companyApi.getCompanies(params).then(res => res.data),
});

export const usePublicCompanyDetail = (id: string) => useQuery({
  queryKey: ['public-company-detail', id],
  queryFn: () => companyApi.getCompanyById(id).then(res => res.data),
  enabled: !!id,
});

import axiosClient from "@/api/axiosClient";
import type { PaginatedResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  taxCode: string;
  description: string;
  websiteUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'BLACKLIST';
  isPremium: boolean;
  ownerId: string;
  createdAt: string;
  _count?: {
    jobs: number;
  };
  jobs?: any[];
}

export interface CreateCompanyDto {
  name: string;
  taxCode: string;
  description: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export const companyApi = {
  getCompanies: (params?: { search?: string; status?: string; page?: number; limit?: number }) => 
    axiosClient.get<PaginatedResponse<Company>>("/companies", { params }),
    
  getCompanyById: (id: string) => 
    axiosClient.get<Company>(`/companies/${id}/public`),
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

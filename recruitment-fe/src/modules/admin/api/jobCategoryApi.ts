import axiosClient from "@/api/axiosClient";
import type { PaginatedResponse } from "@/types/pagination";

export interface JobCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobCategoryDto {
  categoryName: string;
  description?: string;
}

export const jobCategoryApi = {
  getAll: (params?: { page?: number; limit?: number }) => 
    axiosClient.get<PaginatedResponse<JobCategory>>('/job-categories', { params }),
  
  create: (dto: JobCategoryDto) => 
    axiosClient.post<JobCategory>('/job-categories', dto),
    
  update: (id: string, dto: JobCategoryDto) => 
    axiosClient.patch<JobCategory>(`/job-categories/${id}`, dto),
    
  delete: (id: string) => 
    axiosClient.delete(`/job-categories/${id}`),
};

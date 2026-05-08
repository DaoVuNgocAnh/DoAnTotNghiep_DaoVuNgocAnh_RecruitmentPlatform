import axiosClient from "@/api/axiosClient";

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
  getAll: () => axiosClient.get<JobCategory[]>('/job-categories'),
  
  create: (dto: JobCategoryDto) => 
    axiosClient.post<JobCategory>('/job-categories', dto),
    
  update: (id: string, dto: JobCategoryDto) => 
    axiosClient.patch<JobCategory>(`/job-categories/${id}`, dto),
    
  delete: (id: string) => 
    axiosClient.delete(`/job-categories/${id}`),
};

import { apiClient } from "@/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const jobApi = {
  // Categories
  getCategories: () => apiClient.get("/job-categories"),
  
  // Jobs
  createJob: (data: any) => apiClient.post("/jobs", data),
  getAllJobs: (params?: any) => apiClient.get("/jobs", { params }),
  getJobDetail: (id: string) => apiClient.get(`/jobs/${id}`),
};

// --- HOOKS ---
export const useJobCategories = () => useQuery({
  queryKey: ['job-categories'],
  queryFn: () => jobApi.getCategories().then(res => res.data)
});

export const useAllJobs = (params?: any) => useQuery({
  queryKey: ['jobs', params],
  queryFn: () => jobApi.getAllJobs(params).then(res => res.data)
});

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobApi.createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
  });
};
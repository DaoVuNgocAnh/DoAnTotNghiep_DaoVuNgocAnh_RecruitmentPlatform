import axiosClient from '@/api/axiosClient';
import type { PaginatedResponse } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';

export const companyApi = {
  searchByTaxCode: (taxCode: string) =>
    axiosClient.get(`/companies/search?taxCode=${taxCode}`),

  sendJoinRequest: (companyId: string) =>
    axiosClient.post(`/companies/join/${companyId}`),

  createCompany: (data: any) => axiosClient.post('/companies', data),

  deleteMyCompany: () => axiosClient.delete('/companies/my-company'),

  getJoinRequests: (params?: { page?: number; limit?: number }) => 
    axiosClient.get<PaginatedResponse<any>>('/companies/my-company/requests', { params }),

  getMembers: (params?: { page?: number; limit?: number }) => 
    axiosClient.get<PaginatedResponse<any>>('/companies/my-company/members', { params }),

  assignMemberToJob: (jobId: string, userId: string) =>
    axiosClient.post(`/companies/jobs/${jobId}/assignees`, { userId }),

  unassignMemberFromJob: (jobId: string, userId: string) =>
    axiosClient.delete(`/companies/jobs/${jobId}/assignees/${userId}`),

  handleJoinRequest: (requestId: string, status: 'ACCEPTED' | 'REJECTED') =>
    axiosClient.patch(`/companies/requests/${requestId}/${status}`),

  cancelJoinRequest: (requestId: string) =>
    axiosClient.delete(`/companies/requests/${requestId}/cancel`),

  // PREMIUM REQUESTS
  createPremiumRequest: (data: { contactPhone: string; contactEmail: string; note?: string }) =>
    axiosClient.post('/companies/premium-request', data),

  getAdminPremiumRequests: (params?: { status?: string; page?: number; limit?: number }) => {
    const cleanParams = { ...params };
    if (cleanParams.status === 'ALL') delete cleanParams.status;
    return axiosClient.get<PaginatedResponse<any>>('/companies/admin/premium-requests', { params: cleanParams });
  },

  handlePremiumRequest: (id: string, status: 'APPROVED' | 'REJECTED') =>
    axiosClient.patch(`/companies/premium-request/${id}/handle`, { status }),

  getAnalytics: () => axiosClient.get('/companies/analytics').then(res => res.data),
};

export const useCompanyAnalytics = () => useQuery({
  queryKey: ['company-analytics'],
  queryFn: companyApi.getAnalytics,
});

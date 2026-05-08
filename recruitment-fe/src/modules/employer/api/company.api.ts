import axiosClient from '@/api/axiosClient';

export const companyApi = {
  searchByTaxCode: (taxCode: string) =>
    axiosClient.get(`/companies/search?taxCode=${taxCode}`),

  sendJoinRequest: (companyId: string) =>
    axiosClient.post(`/companies/join/${companyId}`),

  createCompany: (data: any) => axiosClient.post('/companies', data),

  deleteMyCompany: () => axiosClient.delete('/companies/my-company'),

  getJoinRequests: () => axiosClient.get('/companies/my-company/requests'),

  getMembers: () => axiosClient.get('/companies/my-company/members'),

  assignMemberToJob: (jobId: string, userId: string) =>
    axiosClient.post(`/companies/jobs/${jobId}/assignees`, { userId }),

  unassignMemberFromJob: (jobId: string, userId: string) =>
    axiosClient.delete(`/companies/jobs/${jobId}/assignees/${userId}`),

  handleJoinRequest: (requestId: string, status: 'ACCEPTED' | 'REJECTED') =>
    axiosClient.patch(`/companies/requests/${requestId}/${status}`),

  cancelJoinRequest: (requestId: string) =>
    axiosClient.delete(`/companies/requests/${requestId}/cancel`),
};

import axiosClient from '@/api/axiosClient';

export const companyApi = {
  // Tìm kiếm công ty qua mã số thuế
  searchByTaxCode: (taxCode: string) =>
    axiosClient.get(`/companies/search?taxCode=${taxCode}`),

  // Gửi yêu cầu gia nhập
  sendJoinRequest: (companyId: string) =>
    axiosClient.post(`/companies/join/${companyId}`),

  // Tạo công ty mới (Cho Owner)
  createCompany: (data: any) => axiosClient.post('/companies', data),

  // Thêm API xóa hồ sơ bị từ chối
  deleteMyCompany: () => axiosClient.delete('/companies/my-company'),

  // Lấy danh sách HR đang xin gia nhập
  getJoinRequests: () => axiosClient.get('/companies/my-company/requests'),

  // Duyệt hoặc Từ chối HR
  // status: 'ACCEPTED' hoặc 'REJECTED'
  handleJoinRequest: (requestId: string, status: 'ACCEPTED' | 'REJECTED') =>
    axiosClient.patch(`/companies/requests/${requestId}/${status}`),

  // Hủy yêu cầu gia nhập (Dành cho HR)
  cancelJoinRequest: (requestId: string) => 
    axiosClient.delete(`/companies/requests/${requestId}/cancel`),
};

import axiosClient from '@/api/axiosClient';

export const authApi = {
  register: (data: any) => axiosClient.post('/auth/register', data),
  login: (data: any) => axiosClient.post('/auth/login', data),
};
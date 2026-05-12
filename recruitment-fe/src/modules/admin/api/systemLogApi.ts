import axiosClient from '@/api/axiosClient';
import type { PaginatedResponse } from '@/types/pagination';

export interface SystemLog {
  id: string;
  actionType: string;
  targetType: string;
  description: string;
  actionDate: string;
  user: {
    email: string;
    fullName: string;
  };
}

export const getSystemLogs = async (params: { 
  page?: number; 
  limit?: number; 
  actionType?: string; 
  targetType?: string; 
  userEmail?: string; 
}): Promise<PaginatedResponse<SystemLog>> => {
  const { data } = await axiosClient.get(`/system-logs`, {
    params,
  });
  return data;
};

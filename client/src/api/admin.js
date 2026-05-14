import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const adminAPI = {
  getUsers: (params) => axiosInstance.get(API_ENDPOINTS.ADMIN.USERS, { params }),
  updateUserStatus: (id, data) => axiosInstance.patch(API_ENDPOINTS.ADMIN.UPDATE_USER_STATUS(id), data),
  getStats: () => axiosInstance.get(API_ENDPOINTS.ADMIN.STATS),
  getSubscriptions: (params) => axiosInstance.get(API_ENDPOINTS.ADMIN.SUBSCRIPTIONS, { params }),
};

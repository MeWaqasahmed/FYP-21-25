import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const notificationsAPI = {
  get: (params) => axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.GET, { params }),
  markRead: (id) => axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
  markAllRead: () => axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
};

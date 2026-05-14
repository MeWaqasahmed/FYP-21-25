import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const aiAPI = {
  generate: (data) => axiosInstance.post(API_ENDPOINTS.AI.GENERATE, data),
  schedulePost: (data) => axiosInstance.post(API_ENDPOINTS.AI.SCHEDULE_POST, data),
};

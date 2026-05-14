import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authAPI = {
  register: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data),
  login: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data),
  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),
  getMe: () => axiosInstance.get(API_ENDPOINTS.AUTH.ME),
  updateProfile: (data) => axiosInstance.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data),
  forgotPassword: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data),
  resetPassword: (token, data) => axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD(token), data),
};

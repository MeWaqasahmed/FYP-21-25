import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const storeAPI = {
  create: (data) => axiosInstance.post(API_ENDPOINTS.STORE.CREATE, data),
  getMy: () => axiosInstance.get(API_ENDPOINTS.STORE.MY),
  update: (data) => axiosInstance.patch(API_ENDPOINTS.STORE.UPDATE, data),
  delete: () => axiosInstance.delete(API_ENDPOINTS.STORE.DELETE),
  getPublic: (username) => axiosInstance.get(API_ENDPOINTS.STORE.PUBLIC(username)),
  browse: (params) => axiosInstance.get(API_ENDPOINTS.STORE.BROWSE, { params }),
};

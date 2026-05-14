import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const productsAPI = {
  upload: (data) => axiosInstance.post(API_ENDPOINTS.PRODUCTS.UPLOAD, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMy: (params) => axiosInstance.get(API_ENDPOINTS.PRODUCTS.MY, { params }),
  get: (id) => axiosInstance.get(API_ENDPOINTS.PRODUCTS.GET(id)),
  update: (id, data) => axiosInstance.patch(API_ENDPOINTS.PRODUCTS.UPDATE(id), data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosInstance.delete(API_ENDPOINTS.PRODUCTS.DELETE(id)),
};

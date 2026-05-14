import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const analyticsAPI = {
  getSummary: (params) => axiosInstance.get(API_ENDPOINTS.ANALYTICS.SUMMARY, { params }),
  getClicks: (params) => axiosInstance.get(API_ENDPOINTS.ANALYTICS.CLICKS, { params }),
  getProducts: (params) => axiosInstance.get(API_ENDPOINTS.ANALYTICS.PRODUCTS, { params }),
  export: (params) => axiosInstance.get(API_ENDPOINTS.ANALYTICS.EXPORT, { 
    params,
    responseType: 'blob',
  }),
};

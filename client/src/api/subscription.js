import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const subscriptionAPI = {
  getPlans: () => axiosInstance.get(API_ENDPOINTS.SUBSCRIPTION.PLANS),
  createCheckout: (data) => axiosInstance.post(API_ENDPOINTS.SUBSCRIPTION.CHECKOUT, data),
  getMy: () => axiosInstance.get(API_ENDPOINTS.SUBSCRIPTION.MY),
  cancel: () => axiosInstance.delete(API_ENDPOINTS.SUBSCRIPTION.CANCEL),
};

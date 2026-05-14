import axios from 'axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Track API doesn't need authentication
export const trackAPI = {
  click: (productId) => axios.post(API_ENDPOINTS.TRACK.CLICK(productId)),
};

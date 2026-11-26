import apiClient from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'

export const authService = {
  login: (payload) => apiClient.post(API_ENDPOINTS.auth.login, payload),
  register: (payload) => apiClient.post(API_ENDPOINTS.auth.register, payload),
  getCurrentUser: () => apiClient.get(API_ENDPOINTS.auth.me),
}
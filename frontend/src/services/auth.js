import api from '../utils/axios';

export const authService = {
  // Register user
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/user/');
    return response.data;
  }
};
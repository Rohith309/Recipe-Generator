import api from '../utils/axios';

export const authService = {
  async login(credentials) {
    const response = await api.post('/token/', credentials);
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  },
}; 
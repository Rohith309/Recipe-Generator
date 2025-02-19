import axios from 'axios';
import { authService } from '../services/auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config); // Log the request configuration
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('Request Error:', error); // Log the request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response); // Log the response
    return response;
  },
  async (error) => {
    console.log('Response Error:', error); // Log the response error
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await authService.refreshToken();
        if (refreshResponse && refreshResponse.access) {
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
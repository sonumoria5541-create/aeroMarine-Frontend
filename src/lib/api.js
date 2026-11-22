import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const baseURL = rawApiUrl
  ? `${rawApiUrl.replace(/\/$/, '')}/api`
  : '/api';

export const getApiErrorMessage = (error, defaultMsg = 'An unexpected error occurred') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return defaultMsg;
};

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aeromarine_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap backend error messages and handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract human-readable error message from server
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (error.message === 'Network Error' || !error.response) {
      error.message = 'Unable to connect to server. Please check your internet or server status.';
    }

    if (error.response?.status === 401) {
      // If unauthorized and not on login/register page, clear token
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        localStorage.removeItem('aeromarine_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

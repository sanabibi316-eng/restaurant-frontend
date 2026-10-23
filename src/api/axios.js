import axios from 'axios';

// Get base URL from environment or default to production backend
export const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'https://restaurant-backend-fawn-chi.vercel.app';

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 15000
});

// Request interceptor — attach token & set headers dynamically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser automatically set the multipart/form-data boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ message, status: error.response?.status, response: error.response });
  }
);

export default API;

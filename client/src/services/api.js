import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60s — Claude can be slow on long JDs
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;

import axios from 'axios';

export class ApiRequestError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ApiRequestError';
    this.details = details;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('linkbin_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const details = error.response?.data?.details || null;
    return Promise.reject(new ApiRequestError(message, details));
  }
);

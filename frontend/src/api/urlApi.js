import { api } from './axios.js';

export const createShortUrl = async (payload) => {
  const response = await api.post('/api/urls', payload);
  return response.data.data;
};

export const listShortUrls = async () => {
  const response = await api.get('/api/urls');
  return response.data.data.shortUrls;
};

export const updateShortUrl = async (id, payload) => {
  const response = await api.patch(`/api/urls/${id}`, payload);
  return response.data.data.shortUrl;
};

export const deleteShortUrl = async (id) => {
  const response = await api.delete(`/api/urls/${id}`);
  return response.data;
};

export const getUrlAnalytics = async (id) => {
  const response = await api.get(`/api/urls/${id}/analytics`);
  return response.data.data;
};

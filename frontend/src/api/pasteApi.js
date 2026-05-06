import { api } from './axios.js';

export const createPaste = async (payload) => {
  const response = await api.post('/api/pastes', payload);
  return response.data.data;
};

export const listPastes = async () => {
  const response = await api.get('/api/pastes');
  return response.data.data.pastes;
};

export const updatePaste = async (id, payload) => {
  const response = await api.patch(`/api/pastes/${id}`, payload);
  return response.data.data.paste;
};

export const deletePaste = async (id) => {
  const response = await api.delete(`/api/pastes/${id}`);
  return response.data;
};

export const getPasteBySlug = async (slug) => {
  const response = await api.get(`/p/${slug}`);
  return response.data.data.paste;
};

export const getPasteAnalytics = async (id) => {
  const response = await api.get(`/api/pastes/${id}/analytics`);
  return response.data.data;
};

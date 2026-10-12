import api from './api';

export const requestService = {
  getMyRequests: async () => {
    const res = await api.get('/requests/my');
    return res.data;
  },

  getRequestDetails: async (id) => {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  },

  createRequest: async (data) => {
    const res = await api.post('/requests', data);
    return res.data;
  },

  submitDraftRequest: async (id) => {
    const res = await api.post(`/requests/${id}/submit`);
    return res.data;
  },

  cancelRequest: async (id, comment) => {
    const res = await api.post(`/requests/${id}/cancel`, { comment });
    return res.data;
  },
};

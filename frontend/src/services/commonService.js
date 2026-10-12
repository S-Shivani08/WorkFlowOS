import api from './api';

export const commonService = {
  getDepartments: async () => {
    const res = await api.get('/common/departments');
    return res.data;
  },

  getActiveUsers: async () => {
    const res = await api.get('/common/users');
    return res.data;
  },
};

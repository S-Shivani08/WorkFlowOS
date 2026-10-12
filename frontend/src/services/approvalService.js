import api from './api';

export const approvalService = {
  getPendingApprovals: async () => {
    const res = await api.get('/approvals/pending');
    return res.data;
  },

  getApprovalHistory: async () => {
    const res = await api.get('/approvals/history');
    return res.data;
  },

  approveRequest: async (requestId, comment) => {
    const res = await api.post(`/approvals/${requestId}/approve`, { comment });
    return res.data;
  },

  rejectRequest: async (requestId, comment) => {
    const res = await api.post(`/approvals/${requestId}/reject`, { comment });
    return res.data;
  },
};

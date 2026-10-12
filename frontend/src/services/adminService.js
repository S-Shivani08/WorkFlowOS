import api from './api';

export const adminService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getAllRequests: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    const res = await api.get(`/admin/requests?${params.toString()}`);
    return res.data;
  },

  // Users
  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post('/admin/users', userData);
    return res.data;
  },

  updateUser: async (id, userData) => {
    const res = await api.put(`/admin/users/${id}`, userData);
    return res.data;
  },

  toggleUserStatus: async (id) => {
    const res = await api.patch(`/admin/users/${id}/toggle-status`);
    return res.data;
  },

  // Departments
  getAllDepartments: async () => {
    const res = await api.get('/admin/departments');
    return res.data;
  },

  createDepartment: async (data) => {
    const res = await api.post('/admin/departments', data);
    return res.data;
  },

  updateDepartment: async (id, data) => {
    const res = await api.put(`/admin/departments/${id}`, data);
    return res.data;
  },

  deleteDepartment: async (id) => {
    const res = await api.delete(`/admin/departments/${id}`);
    return res.data;
  },

  // Workflows
  getAllWorkflows: async () => {
    const res = await api.get('/admin/workflows');
    return res.data;
  },

  getWorkflowById: async (id) => {
    const res = await api.get(`/admin/workflows/${id}`);
    return res.data;
  },

  createWorkflow: async (data) => {
    const res = await api.post('/admin/workflows', data);
    return res.data;
  },

  updateWorkflow: async (id, data) => {
    const res = await api.put(`/admin/workflows/${id}`, data);
    return res.data;
  },

  deleteWorkflow: async (id) => {
    const res = await api.delete(`/admin/workflows/${id}`);
    return res.data;
  },
};

import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { commonService } from '../services/commonService';
import { Users, UserPlus, Search, Shield, Check, X, Building } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'ROLE_EMPLOYEE',
    departmentId: '',
    jobTitle: '',
    phone: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uList, dList] = await Promise.all([
        adminService.getAllUsers(),
        commonService.getDepartments(),
      ]);
      setUsers(uList);
      setDepartments(dList);
      if (dList.length > 0 && !formData.departmentId) {
        setFormData((prev) => ({ ...prev, departmentId: dList[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleUserStatus(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser({
        ...formData,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
      });
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        role: 'ROLE_EMPLOYEE',
        departmentId: departments[0]?.id || '',
        jobTitle: '',
        phone: '',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      (u.jobTitle && u.jobTitle.toLowerCase().includes(s)) ||
      (u.departmentName && u.departmentName.toLowerCase().includes(s))
    );
  });

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Corporate Staff & User Directory
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Manage company employees, managers, department heads, and authorization roles
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={16} />
          <span>Add Corporate User</span>
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, department, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>Loading directory...</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Name & Email</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Security Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{u.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>{u.email}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{u.jobTitle || '—'}</td>
                      <td>
                        {u.departmentName ? (
                          <span className="badge badge-dept">{u.departmentName}</span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-role">{u.role.replace('ROLE_', '')}</span>
                      </td>
                      <td>
                        <span className={`badge ${u.active ? 'badge-approved' : 'badge-rejected'}`}>
                          {u.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.active ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => handleToggleStatus(u.id)}
                        >
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create Corporate User</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Corporate Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="john.doe@workflowos.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Security Role</label>
                    <select
                      className="form-control"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="ROLE_EMPLOYEE">Employee</option>
                      <option value="ROLE_MANAGER">Manager</option>
                      <option value="ROLE_DEPT_HEAD">Department Head</option>
                      <option value="ROLE_ADMIN">System Admin</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-control"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

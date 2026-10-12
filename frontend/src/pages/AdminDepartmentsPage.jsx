import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { Building, Plus, Users, X, Trash2 } from 'lucide-react';

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createDepartment(formData);
      setIsModalOpen(false);
      setFormData({ name: '', code: '', description: '' });
      loadDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create department.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await adminService.deleteDepartment(id);
      loadDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department.');
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Corporate Departments
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Company organizational business units & staff allocations
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading departments...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {departments.map((d) => (
            <div key={d.id} className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <div>
                  <span className="badge badge-dept" style={{ marginBottom: 6 }}>{d.code}</span>
                  <h3 className="card-title">{d.name}</h3>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#dc2626' }}
                  onClick={() => handleDelete(d.id)}
                  title="Delete Department"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="card-body">
                <p style={{ fontSize: '0.88rem', color: '#64748b', minHeight: 44, marginBottom: 16 }}>
                  {d.description || 'No description provided.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: '0.82rem' }}>
                    <Users size={16} color="#2563eb" />
                    <strong>{d.employeeCount}</strong> active staff member{d.employeeCount === 1 ? '' : 's'}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID #{d.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create Corporate Department</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Legal & Compliance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department Code (Short)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. LEG"
                    maxLength={10}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Scope, operational charter, and functions..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Save Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartmentsPage;

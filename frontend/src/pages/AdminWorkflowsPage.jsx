import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { commonService } from '../services/commonService';
import { GitMerge, Plus, ArrowRight, Shield, User, Check, X, Trash2 } from 'lucide-react';

const AdminWorkflowsPage = () => {
  const [workflows, setWorkflows] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Workflow form state
  const [formData, setFormData] = useState({
    name: '',
    requestType: 'LEAVE',
    departmentId: '',
    description: '',
    isActive: true,
    steps: [
      { stepOrder: 1, stepName: 'Initial Department Review', approverRule: 'ROLE_IN_DEPT', requiredRole: 'ROLE_MANAGER', assignedUserId: '' },
      { stepOrder: 2, stepName: 'Executive Authorization', approverRule: 'DEPT_HEAD', requiredRole: 'ROLE_DEPT_HEAD', assignedUserId: '' },
    ],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wfList, deptList, userList] = await Promise.all([
        adminService.getAllWorkflows(),
        commonService.getDepartments(),
        commonService.getActiveUsers(),
      ]);
      setWorkflows(wfList);
      setDepartments(deptList);
      setUsers(userList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          stepOrder: prev.steps.length + 1,
          stepName: `Step ${prev.steps.length + 1} Review`,
          approverRule: 'ROLE',
          requiredRole: 'ROLE_MANAGER',
          assignedUserId: '',
        },
      ],
    }));
  };

  const handleRemoveStep = (index) => {
    if (formData.steps.length <= 1) return;
    const updated = formData.steps.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      stepOrder: i + 1,
    }));
    setFormData((prev) => ({ ...prev, steps: updated }));
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...formData.steps];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, steps: updated }));
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        requestType: formData.requestType,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        description: formData.description,
        isActive: formData.isActive,
        steps: formData.steps.map((s) => ({
          stepOrder: s.stepOrder,
          stepName: s.stepName,
          approverRule: s.approverRule,
          requiredRole: s.requiredRole || null,
          assignedUserId: s.assignedUserId ? Number(s.assignedUserId) : null,
        })),
      };

      await adminService.createWorkflow(payload);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create workflow.');
    }
  };

  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm('Delete this workflow?')) return;
    try {
      await adminService.deleteWorkflow(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete workflow.');
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Approval Routing Workflows
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Configure multi-stage routing rules and sequential approver assignment pipelines
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>New Workflow Pipeline</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading workflows...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {workflows.map((wf) => (
            <div key={wf.id} className="card">
              <div className="card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-dept">{wf.requestType}</span>
                    <span className={`badge ${wf.active ? 'badge-approved' : 'badge-draft'}`}>
                      {wf.active ? 'Active' : 'Disabled'}
                    </span>
                    {wf.departmentName && (
                      <span className="badge badge-role">Dept: {wf.departmentName}</span>
                    )}
                  </div>
                  <h3 className="card-title">{wf.name}</h3>
                  <p className="card-subtitle">{wf.description}</p>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#dc2626' }}
                  onClick={() => handleDeleteWorkflow(wf.id)}
                  title="Delete Workflow"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="card-body">
                <strong style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 12 }}>
                  Sequential Approval Pipeline ({wf.steps?.length || 0} Stages):
                </strong>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {wf.steps?.map((step, idx) => (
                    <React.Fragment key={step.id || idx}>
                      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', minWidth: '190px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb' }}>
                            STAGE {step.stepOrder}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{step.approverRule}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{step.stepName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                          {step.assignedUserName ? (
                            <span>User: {step.assignedUserName}</span>
                          ) : step.requiredRole ? (
                            <span>Role: {step.requiredRole.replace('ROLE_', '')}</span>
                          ) : (
                            <span>Rule: {step.approverRule}</span>
                          )}
                        </div>
                      </div>

                      {idx < wf.steps.length - 1 && (
                        <ArrowRight size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Workflow Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Configure New Routing Pipeline</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Workflow Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Executive Capital Expenditure Routing"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Request Type</label>
                    <select
                      className="form-control"
                      value={formData.requestType}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                    >
                      <option value="LEAVE">Leave</option>
                      <option value="PURCHASE">Purchase</option>
                      <option value="REIMBURSEMENT">Reimbursement</option>
                      <option value="IT_SUPPORT">IT Support</option>
                      <option value="ADMIN_REQUEST">Administrative</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Scope (Department)</label>
                    <select
                      className="form-control"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    >
                      <option value="">Global (All Departments)</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brief description of approval stages..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Pipeline Steps (Ordered Execution):</strong>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddStep}>
                      <Plus size={14} /> Add Stage
                    </button>
                  </div>

                  {formData.steps.map((st, i) => (
                    <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '12px', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>Stage {st.stepOrder}</span>
                        {formData.steps.length > 1 && (
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem' }}
                            onClick={() => handleRemoveStep(i)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Step Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={st.stepName}
                            onChange={(e) => handleStepChange(i, 'stepName', e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Approver Rule</label>
                          <select
                            className="form-control"
                            value={st.approverRule}
                            onChange={(e) => handleStepChange(i, 'approverRule', e.target.value)}
                          >
                            <option value="ROLE_IN_DEPT">Manager in Requester's Dept</option>
                            <option value="DEPT_HEAD">Department Head</option>
                            <option value="ROLE">Any User with Role</option>
                            <option value="SPECIFIC_USER">Specific User</option>
                          </select>
                        </div>
                      </div>

                      {st.approverRule === 'SPECIFIC_USER' && (
                        <div className="form-group">
                          <label className="form-label">Assigned Specific Approver</label>
                          <select
                            className="form-control"
                            value={st.assignedUserId}
                            onChange={(e) => handleStepChange(i, 'assignedUserId', e.target.value)}
                            required
                          >
                            <option value="">Select Corporate Approver...</option>
                            {users.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name} ({u.jobTitle || u.role.replace('ROLE_', '')})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {st.approverRule === 'ROLE' && (
                        <div className="form-group">
                          <label className="form-label">Required Role</label>
                          <select
                            className="form-control"
                            value={st.requiredRole}
                            onChange={(e) => handleStepChange(i, 'requiredRole', e.target.value)}
                          >
                            <option value="ROLE_MANAGER">Manager</option>
                            <option value="ROLE_DEPT_HEAD">Department Head</option>
                            <option value="ROLE_ADMIN">System Administrator</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Save Workflow Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkflowsPage;

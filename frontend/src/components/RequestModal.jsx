import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { commonService } from '../services/commonService';
import { X, Send, AlertCircle, Info, Sparkles } from 'lucide-react';

const WORKFLOW_DESCRIPTIONS = {
  LEAVE: '2-Stage Pipeline: Direct Department Manager Initial Check → HR Department Head Final Approval',
  PURCHASE: '3-Stage Pipeline: Department Head Review → Finance Manager Budget Check → CFO / Finance Head Final Sign-off',
  REIMBURSEMENT: '2-Stage Pipeline: Department Manager Verification → Finance Approvals Clearance',
  IT_SUPPORT: '2-Stage Security Pipeline: IT Support Manager Assessment → VP of Technology Authorization',
  ADMIN_REQUEST: '1-Stage Pipeline: Operations Directorate Authorization',
};

const RequestModal = ({ isOpen, onClose, onSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    requestType: 'LEAVE',
    title: '',
    description: '',
    departmentId: '',
    priority: 'MEDIUM',
    amount: '',
    startDate: '',
    endDate: '',
    submitImmediately: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      commonService.getDepartments()
        .then((data) => {
          setDepartments(data);
          if (data.length > 0 && !formData.departmentId) {
            setFormData((prev) => ({ ...prev, departmentId: data[0].id }));
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        requestType: formData.requestType,
        title: formData.title,
        description: formData.description,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        priority: formData.priority,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        submitImmediately: formData.submitImmediately,
      };

      await requestService.createRequest(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="#2563eb" />
            <h2 className="modal-title">Create Corporate Request</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Request Type</label>
                <select
                  name="requestType"
                  className="form-control"
                  value={formData.requestType}
                  onChange={handleChange}
                  required
                >
                  <option value="LEAVE">Leave Request</option>
                  <option value="PURCHASE">Purchase Request</option>
                  <option value="REIMBURSEMENT">Reimbursement Request</option>
                  <option value="IT_SUPPORT">IT Support & Permissions</option>
                  <option value="ADMIN_REQUEST">General Administrative</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Applicable Department</label>
                <select
                  name="departmentId"
                  className="form-control"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Workflow Preview Card */}
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 14px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Info size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.82rem', color: '#1e40af', display: 'block' }}>Configured Automatic Routing:</strong>
                <p style={{ fontSize: '0.8rem', color: '#1d4ed8', margin: 0 }}>
                  {WORKFLOW_DESCRIPTIONS[formData.requestType]}
                </p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Title / Summary</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. Annual Vacation / Dual 4K Monitor Requisition"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Business Justification</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Provide detailed description, purpose, project context, or handover notes..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {(formData.requestType === 'PURCHASE' || formData.requestType === 'REIMBURSEMENT') && (
                <div className="form-group">
                  <label className="form-label">Estimated Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {formData.requestType === 'LEAVE' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      className="form-control"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {formData.requestType === 'LEAVE' && (
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="submitImmediately"
                name="submitImmediately"
                checked={formData.submitImmediately}
                onChange={handleChange}
              />
              <label htmlFor="submitImmediately" style={{ fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                Submit immediately to trigger automatic approval routing (uncheck to save as draft)
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={15} />
              <span>{loading ? 'Routing Request...' : formData.submitImmediately ? 'Submit & Route' : 'Save Draft'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;

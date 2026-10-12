import React, { useState } from 'react';
import { approvalService } from '../services/approvalService';
import { X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const ApprovalModal = ({ isOpen, onClose, request, actionType, onSuccess }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const isApprove = actionType === 'APPROVE';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isApprove) {
        await approvalService.approveRequest(request.id, comment);
      } else {
        await approvalService.rejectRequest(request.id, comment);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process decision.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isApprove ? (
              <CheckCircle2 size={22} color="#16a34a" />
            ) : (
              <XCircle size={22} color="#dc2626" />
            )}
            <h2 className="modal-title">
              {isApprove ? 'Approve Request' : 'Reject Request'}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Request #{request.id}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', margin: '2px 0 4px 0' }}>{request.title}</div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                Submitted by <strong>{request.requesterName}</strong> • Step: <strong>{request.currentStepName || 'Step ' + request.currentStepOrder}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isApprove ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
              </label>
              <textarea
                className="form-control"
                placeholder={isApprove ? 'e.g. Budget verified, approved for disbursement.' : 'Please provide justification for rejection...'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required={!isApprove}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${isApprove ? 'btn-success' : 'btn-danger'}`}
              disabled={loading}
            >
              {isApprove ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{loading ? 'Processing...' : isApprove ? 'Approve & Advance' : 'Reject Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApprovalModal;

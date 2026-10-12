import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import WorkflowStepper from '../components/WorkflowStepper';
import StatusBadge from '../components/StatusBadge';
import ApprovalModal from '../components/ApprovalModal';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Send,
  Ban,
  Clock,
  User,
  Building,
  DollarSign,
  Calendar,
  ShieldAlert,
  FileCheck,
  History
} from 'lucide-react';

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalAction, setModalAction] = useState(null); // 'APPROVE' | 'REJECT' | null

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await requestService.getRequestDetails(id);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDraftSubmit = async () => {
    if (!window.confirm('Submit this draft request to trigger automatic approval routing?')) return;
    try {
      await requestService.submitDraftRequest(id);
      loadRequest();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request.');
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Please provide a reason for cancelling this request:');
    if (reason === null) return;
    try {
      await requestService.cancelRequest(id, reason);
      loadRequest();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request.');
    }
  };

  if (loading) {
    return <div className="page-content" style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>Loading request timeline...</div>;
  }

  if (error || !data) {
    return (
      <div className="page-content">
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px', color: '#b91c1c', marginBottom: 20 }}>
          {error || 'Request not found'}
        </div>
        <Link to="/my-requests" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Requests</span>
        </Link>
      </div>
    );
  }

  const { request, workflowSteps, approvals, timeline } = data;

  // Determine if current user can approve/reject
  const isAssignedApprover = request.currentApproverId === user?.id;
  const canDecide = (isAssignedApprover || isAdmin) && request.status === 'PENDING_APPROVAL';
  const isRequester = request.requesterId === user?.id;
  const isDraft = request.status === 'DRAFT';
  const canCancel = (isRequester || isAdmin) && request.status !== 'APPROVED' && request.status !== 'REJECTED' && request.status !== 'CANCELLED';

  return (
    <div className="page-content">
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isDraft && isRequester && (
            <button className="btn btn-primary" onClick={handleDraftSubmit}>
              <Send size={15} />
              <span>Submit for Approval</span>
            </button>
          )}

          {canDecide && (
            <>
              <button className="btn btn-success" onClick={() => setModalAction('APPROVE')}>
                <CheckCircle2 size={16} />
                <span>Approve & Advance Step</span>
              </button>
              <button className="btn btn-danger" onClick={() => setModalAction('REJECT')}>
                <XCircle size={16} />
                <span>Reject</span>
              </button>
            </>
          )}

          {canCancel && !isDraft && (
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
              <Ban size={14} />
              <span>Cancel Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Request Header Banner */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Request #{request.id}</span>
                <span className="badge badge-dept">{request.requestType}</span>
                <StatusBadge status={request.status} />
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 8 }}>
                {request.title}
              </h1>
              <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: 800, whiteSpace: 'pre-line' }}>
                {request.description}
              </p>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {request.amount && (
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>
                  ${parseFloat(request.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              )}
              {request.startDate && (
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <Calendar size={14} /> {request.startDate} to {request.endDate}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Priority: <strong style={{ color: request.priority === 'URGENT' ? '#dc2626' : '#0f172a' }}>{request.priority}</strong>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Workflow Routing Progress: {request.workflowName || 'Configured Pipeline'}
              </strong>
              {request.currentStepName && request.status === 'PENDING_APPROVAL' && (
                <span style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>
                  Awaiting decision at Step {request.currentStepOrder}: {request.currentStepName}
                </span>
              )}
            </div>

            <WorkflowStepper
              steps={workflowSteps}
              currentStepOrder={request.currentStepOrder}
              status={request.status}
              currentApproverName={request.currentApproverName}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24 }}>
        {/* Left Column: Metadata & Approvals Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Metadata Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Submission Details</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Requester</div>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{request.requesterName}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>{request.requesterEmail}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Assigned Department</div>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{request.departmentName}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Submission Date</div>
                  <span style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                    {request.submittedAt ? new Date(request.submittedAt).toLocaleString() : 'Not yet submitted'}
                  </span>
                </div>
              </div>

              {request.completedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileCheck size={18} color="#16a34a" />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Final Completion Date</div>
                    <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                      {new Date(request.completedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formal Approval Records */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Formal Review Records</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {approvals.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No approval actions logged yet.
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Step</th>
                        <th>Approver</th>
                        <th>Decision</th>
                        <th>Comments</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvals.map((app) => (
                        <tr key={app.id}>
                          <td style={{ fontWeight: 600 }}>Step {app.stepOrder}</td>
                          <td>
                            <strong style={{ fontSize: '0.85rem' }}>{app.approverName}</strong>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                app.decision === 'APPROVED'
                                  ? 'badge-approved'
                                  : app.decision === 'REJECTED'
                                  ? 'badge-rejected'
                                  : 'badge-pending'
                              }`}
                            >
                              {app.decision}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                            {app.comments || '—'}
                          </td>
                          <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            {app.decidedAt ? new Date(app.decidedAt).toLocaleDateString() : 'Pending'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Full Audit Trail & Chronological Timeline */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={18} color="#2563eb" />
              <h3 className="card-title">Lifecycle Audit Trail & Transfer History</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="timeline">
              {timeline.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-actor">{item.actorName || 'System'}</span>
                      <span className="timeline-time">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <div className="timeline-action">
                      {item.action.replace(/_/g, ' ')}
                    </div>
                    <div className="timeline-comment">{item.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Approval / Rejection Action Modal */}
      <ApprovalModal
        isOpen={!!modalAction}
        onClose={() => setModalAction(null)}
        request={request}
        actionType={modalAction}
        onSuccess={() => {
          setModalAction(null);
          loadRequest();
        }}
      />
    </div>
  );
};

export default RequestDetailPage;

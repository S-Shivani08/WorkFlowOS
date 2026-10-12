import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { approvalService } from '../services/approvalService';
import StatusBadge from '../components/StatusBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  GitMerge,
  AlertCircle
} from 'lucide-react';

const DashboardPage = ({ onOpenNewRequest }) => {
  const { user, isApprover } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [isApprover]);

  const loadData = async () => {
    setLoading(true);
    try {
      const myReqs = await requestService.getMyRequests();
      setRequests(myReqs);

      if (isApprover) {
        const pending = await approvalService.getPendingApprovals();
        setPendingApprovals(pending);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const approved = requests.filter((r) => r.status === 'APPROVED').length;
  const rejected = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {user?.jobTitle} • {user?.departmentName || 'Enterprise Member'}
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewRequest}>
          <PlusCircle size={17} />
          <span>Submit Request</span>
        </button>
      </div>

      {/* Pending Approvals Alert for Managers / Approvers */}
      {isApprover && pendingApprovals.length > 0 && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: '#fef3c7', padding: '8px', borderRadius: '8px', color: '#b45309' }}>
              <Clock size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.95rem', color: '#92400e' }}>
                You have {pendingApprovals.length} pending approval request{pendingApprovals.length > 1 ? 's' : ''} awaiting your review!
              </strong>
              <div style={{ fontSize: '0.82rem', color: '#b45309' }}>
                Requests require authorization to advance to the next configured workflow stage.
              </div>
            </div>
          </div>
          <Link to="/approvals" className="btn btn-primary btn-sm">
            <span>Review Queue</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="metric-title">Total Requests</div>
            <div className="metric-value">{total}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="metric-title">Pending Routing</div>
            <div className="metric-value">{pending}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="metric-title">Fully Approved</div>
            <div className="metric-value">{approved}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
            <XCircle size={24} />
          </div>
          <div>
            <div className="metric-title">Rejected</div>
            <div className="metric-value">{rejected}</div>
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">My Recent Employee Requests</h3>
            <p className="card-subtitle">Real-time status of your active and historical company submissions</p>
          </div>
          <Link to="/my-requests" className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>Loading dashboard...</div>
          ) : requests.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <FileText size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
              <h4 style={{ color: '#0f172a', marginBottom: 4 }}>No requests submitted yet</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: 16 }}>
                Submit a leave, purchase requisition, or reimbursement to test automatic routing.
              </p>
              <button className="btn btn-primary btn-sm" onClick={onOpenNewRequest}>
                <PlusCircle size={15} />
                <span>Create First Request</span>
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Current Step</th>
                    <th>Assigned Approver</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.slice(0, 5).map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600 }}>#{req.id}</td>
                      <td>
                        <span className="badge badge-dept">{req.requestType}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{req.title}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: req.priority === 'URGENT' ? '#dc2626' : req.priority === 'HIGH' ? '#d97706' : '#475569' }}>
                          {req.priority}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {req.currentStepName || '—'}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: req.currentApproverName ? '#2563eb' : '#64748b' }}>
                        {req.currentApproverName ? req.currentApproverName : '—'}
                      </td>
                      <td>
                        <Link to={`/requests/${req.id}`} className="btn btn-secondary btn-sm">
                          View Timeline
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* System Routing Architecture Explainer */}
      <div className="card" style={{ backgroundColor: '#ffffff' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GitMerge size={20} color="#2563eb" />
            <div>
              <h3 className="card-title">Configured Automatic Routing Matrix</h3>
              <p className="card-subtitle">How WorkFlowOS routes employee requests without manual forwarding</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>🌴 Leave Requests</div>
              <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                Employee → <strong>Step 1:</strong> Department Manager → <strong>Step 2:</strong> HR Department Head → <strong>COMPLETED</strong>
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>🛒 Purchase Requisitions</div>
              <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                Employee → <strong>Step 1:</strong> Department Head → <strong>Step 2:</strong> Finance Manager → <strong>Step 3:</strong> CFO / Finance Head → <strong>COMPLETED</strong>
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>💳 Expense Reimbursements</div>
              <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                Employee → <strong>Step 1:</strong> Department Manager → <strong>Step 2:</strong> Finance Manager → <strong>COMPLETED</strong>
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>💻 IT Access & Licenses</div>
              <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                Employee → <strong>Step 1:</strong> IT Support Manager → <strong>Step 2:</strong> VP of Technology → <strong>COMPLETED</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

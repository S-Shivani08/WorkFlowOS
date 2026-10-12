import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { approvalService } from '../services/approvalService';
import StatusBadge from '../components/StatusBadge';
import ApprovalModal from '../components/ApprovalModal';
import { CheckSquare, History, CheckCircle2, XCircle, ArrowRight, DollarSign, Calendar, FileText } from 'lucide-react';

const ApprovalsPage = () => {
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'HISTORY'
  const [pendingRequests, setPendingRequests] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'PENDING') {
        const pending = await approvalService.getPendingApprovals();
        setPendingRequests(pending);
      } else {
        const hist = await approvalService.getApprovalHistory();
        setHistoryRecords(hist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (req, action) => {
    setSelectedRequest(req);
    setModalAction(action);
  };

  return (
    <div className="page-content">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Approver Management Queue
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
          Review employee requests requiring your authorization and monitor decision history
        </p>
      </div>

      <div className="tab-group">
        <button
          className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          <CheckSquare size={16} />
          <span>Pending My Authorization</span>
          {pendingRequests.length > 0 && (
            <span style={{ fontSize: '0.75rem', backgroundColor: '#ef4444', color: 'white', padding: '1px 7px', borderRadius: '10px' }}>
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'HISTORY' ? 'active' : ''}`}
          onClick={() => setActiveTab('HISTORY')}
        >
          <History size={16} />
          <span>My Authorization History</span>
        </button>
      </div>

      {activeTab === 'PENDING' ? (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>Loading pending approvals...</div>
            ) : pendingRequests.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ marginBottom: 12 }} />
                <h4 style={{ color: '#0f172a' }}>All caught up!</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  There are no requests waiting for your authorization at this time.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Requester</th>
                      <th>Type</th>
                      <th>Request Title</th>
                      <th>Current Step</th>
                      <th>Amount / Dates</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((req) => (
                      <tr key={req.id}>
                        <td style={{ fontWeight: 700 }}>#{req.id}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{req.requesterName}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.departmentName}</span>
                        </td>
                        <td>
                          <span className="badge badge-dept">{req.requestType}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{req.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {req.description}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#2563eb', fontSize: '0.82rem' }}>
                            Step {req.currentStepOrder}: {req.currentStepName}
                          </span>
                        </td>
                        <td>
                          {req.amount && (
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#047857', display: 'flex', alignItems: 'center', gap: 2 }}>
                              <DollarSign size={13} /> {parseFloat(req.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          {req.startDate && (
                            <span style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Calendar size={12} /> {req.startDate}
                            </span>
                          )}
                          {!req.amount && !req.startDate && <span style={{ color: '#94a3b8' }}>—</span>}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: req.priority === 'URGENT' ? '#dc2626' : req.priority === 'HIGH' ? '#d97706' : '#475569' }}>
                            {req.priority}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleOpenAction(req, 'APPROVE')}
                              title="Approve & automatically transfer to next workflow stage"
                            >
                              <CheckCircle2 size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleOpenAction(req, 'REJECT')}
                              title="Reject request"
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>
                            <Link to={`/requests/${req.id}`} className="btn btn-secondary btn-sm">
                              Track
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>Loading history...</div>
            ) : historyRecords.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <History size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
                <h4 style={{ color: '#0f172a' }}>No authorization history</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  Decisions made by your account will appear here.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Title</th>
                      <th>Requester</th>
                      <th>Stage Evaluated</th>
                      <th>Your Decision</th>
                      <th>Notes / Comments</th>
                      <th>Decided At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRecords.map((hist) => (
                      <tr key={hist.id}>
                        <td style={{ fontWeight: 700 }}>#{hist.requestId}</td>
                        <td style={{ fontWeight: 600 }}>{hist.requestTitle}</td>
                        <td>{hist.requesterName}</td>
                        <td style={{ fontSize: '0.82rem' }}>
                          Step {hist.stepOrder}: {hist.stepName}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              hist.decision === 'APPROVED'
                                ? 'badge-approved'
                                : hist.decision === 'REJECTED'
                                ? 'badge-rejected'
                                : 'badge-pending'
                            }`}
                          >
                            {hist.decision}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                          {hist.comments || '—'}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {hist.decidedAt ? new Date(hist.decidedAt).toLocaleString() : '—'}
                        </td>
                        <td>
                          <Link to={`/requests/${hist.requestId}`} className="btn btn-secondary btn-sm">
                            View Flow
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
      )}

      <ApprovalModal
        isOpen={!!modalAction}
        onClose={() => {
          setModalAction(null);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        actionType={modalAction}
        onSuccess={() => {
          setModalAction(null);
          setSelectedRequest(null);
          loadData();
        }}
      />
    </div>
  );
};

export default ApprovalsPage;

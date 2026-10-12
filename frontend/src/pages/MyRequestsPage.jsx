import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import StatusBadge from '../components/StatusBadge';
import { PlusCircle, Search, Filter, Calendar, DollarSign, FileText } from 'lucide-react';

const MyRequestsPage = ({ onOpenNewRequest }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await requestService.getMyRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || r.requestType === typeFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search);
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            My Request Submissions
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Track the real-time approval stages of your corporate requests
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewRequest}>
          <PlusCircle size={16} />
          <span>New Request</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="tab-group">
        {['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'DRAFT'].map((st) => (
          <button
            key={st}
            className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st === 'ALL' ? 'All Requests' : st.replace('_', ' ')}
            <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#475569', padding: '1px 6px', borderRadius: '10px' }}>
              {st === 'ALL' ? requests.length : requests.filter((r) => r.status === st).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="filters-bar">
        <div className="search-input-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, description, or request ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="#64748b" />
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Request Types</option>
            <option value="LEAVE">Leave</option>
            <option value="PURCHASE">Purchase</option>
            <option value="REIMBURSEMENT">Reimbursement</option>
            <option value="IT_SUPPORT">IT Support</option>
            <option value="ADMIN_REQUEST">Administrative</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <FileText size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
              <h4 style={{ color: '#0f172a' }}>No requests found</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                Try adjusting your search terms or filter criteria.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Title & Summary</th>
                    <th>Extra Details</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Approver</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 700 }}>#{req.id}</td>
                      <td>
                        <span className="badge badge-dept">{req.requestType}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{req.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {req.description}
                        </div>
                      </td>
                      <td>
                        {req.amount && (
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#047857', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <DollarSign size={13} /> {parseFloat(req.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                        {req.startDate && (
                          <span style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={12} /> {req.startDate} to {req.endDate}
                          </span>
                        )}
                        {!req.amount && !req.startDate && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: req.priority === 'URGENT' ? '#dc2626' : req.priority === 'HIGH' ? '#d97706' : '#475569' }}>
                          {req.priority}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {req.currentApproverName ? (
                          <span style={{ color: '#2563eb', fontWeight: 600 }}>{req.currentApproverName}</span>
                        ) : req.status === 'APPROVED' ? (
                          <span style={{ color: '#16a34a', fontWeight: 600 }}>Completed</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>None</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'Draft'}
                      </td>
                      <td>
                        <Link to={`/requests/${req.id}`} className="btn btn-secondary btn-sm">
                          Track Flow
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
    </div>
  );
};

export default MyRequestsPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { commonService } from '../services/commonService';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, ClipboardList, DollarSign, Calendar } from 'lucide-react';

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    commonService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    loadRequests();
  }, [statusFilter, typeFilter, departmentFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllRequests({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        departmentId: departmentFilter || undefined,
      });
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const s = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(s) ||
      r.requesterName.toLowerCase().includes(s) ||
      r.description.toLowerCase().includes(s) ||
      String(r.id).includes(s)
    );
  });

  return (
    <div className="page-content">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Company Requests Oversight
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
          Global administrative visibility across all departments and routing lifecycles
        </p>
      </div>

      <div className="filters-bar">
        <div className="search-input-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by requester name, title, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="LEAVE">Leave</option>
          <option value="PURCHASE">Purchase</option>
          <option value="REIMBURSEMENT">Reimbursement</option>
          <option value="IT_SUPPORT">IT Support</option>
          <option value="ADMIN_REQUEST">Administrative</option>
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <ClipboardList size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
              <h4 style={{ color: '#0f172a' }}>No requests found</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Adjust search or filter parameters.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Requester</th>
                    <th>Dept</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Current Step</th>
                    <th>Current Approver</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 700 }}>#{req.id}</td>
                      <td>
                        <strong style={{ fontSize: '0.88rem' }}>{req.requesterName}</strong>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>{req.requesterEmail}</span>
                      </td>
                      <td>{req.departmentName}</td>
                      <td>
                        <span className="badge badge-dept">{req.requestType}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{req.title}</div>
                        {req.amount && (
                          <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
                            ${parseFloat(req.amount).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {req.currentStepName || '—'}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: req.currentApproverName ? '#2563eb' : '#64748b' }}>
                        {req.currentApproverName || '—'}
                      </td>
                      <td>
                        <Link to={`/requests/${req.id}`} className="btn btn-secondary btn-sm">
                          Inspect Flow
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

export default AdminRequestsPage;

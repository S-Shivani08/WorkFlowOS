import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { approvalService } from '../services/approvalService';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  History,
  GitMerge,
  Users,
  Building,
  ClipboardList,
  LogOut,
  Layers
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isApprover, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isApprover) {
      approvalService.getPendingApprovals()
        .then((res) => setPendingCount(res.length))
        .catch(() => {});
    }
  }, [isApprover]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">
          <Layers size={20} />
        </div>
        <div>
          <h1 className="brand-title">WorkFlowOS</h1>
          <span className="brand-tag">Enterprise Routing</span>
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-category">Workspace</div>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/my-requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={18} />
          <span>My Requests</span>
        </NavLink>

        {isApprover && (
          <>
            <div className="menu-category">Approver Queue</div>
            <NavLink to="/approvals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CheckSquare size={18} />
              <span>Pending Approvals</span>
              {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
            </NavLink>

            <NavLink to="/approvals-history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <History size={18} />
              <span>Approval History</span>
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <div className="menu-category">Administration</div>
            <NavLink to="/admin/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <ClipboardList size={18} />
              <span>All Company Requests</span>
            </NavLink>

            <NavLink to="/admin/workflows" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <GitMerge size={18} />
              <span>Routing Workflows</span>
            </NavLink>

            <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Staff & Directory</span>
            </NavLink>

            <NavLink to="/admin/departments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Building size={18} />
              <span>Departments</span>
            </NavLink>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <span className="user-role-text">{user?.jobTitle || user?.role?.replace('ROLE_', '')}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

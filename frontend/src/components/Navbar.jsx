import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Building2, Shield } from 'lucide-react';

const Navbar = ({ onOpenNewRequest, pageTitle = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="top-navbar">
      <div className="navbar-breadcrumbs">
        <span>WorkFlowOS</span>
        <span>/</span>
        <strong>{pageTitle}</strong>
      </div>

      <div className="navbar-actions">
        {user?.departmentName && (
          <span className="badge badge-dept" title="Assigned Corporate Department">
            <Building2 size={13} style={{ marginRight: 4 }} />
            {user.departmentName}
          </span>
        )}

        {user?.role && (
          <span className="badge badge-role" title="System Security Role">
            <Shield size={13} style={{ marginRight: 4 }} />
            {user.role.replace('ROLE_', '')}
          </span>
        )}

        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenNewRequest}
          title="Submit a new business request to the workflow routing engine"
        >
          <PlusCircle size={15} />
          <span>New Request</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

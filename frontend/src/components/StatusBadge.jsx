import React from 'react';
import { Clock, CheckCircle2, XCircle, FileText, Ban } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  switch (status) {
    case 'PENDING_APPROVAL':
      return (
        <span className="badge badge-pending">
          <Clock size={12} /> Pending Approval
        </span>
      );
    case 'APPROVED':
      return (
        <span className="badge badge-approved">
          <CheckCircle2 size={12} /> Approved
        </span>
      );
    case 'REJECTED':
      return (
        <span className="badge badge-rejected">
          <XCircle size={12} /> Rejected
        </span>
      );
    case 'DRAFT':
      return (
        <span className="badge badge-draft">
          <FileText size={12} /> Draft
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="badge badge-cancelled">
          <Ban size={12} /> Cancelled
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};

export default StatusBadge;

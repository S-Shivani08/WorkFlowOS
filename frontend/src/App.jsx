import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RequestModal from './components/RequestModal';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MyRequestsPage from './pages/MyRequestsPage';
import RequestDetailPage from './pages/RequestDetailPage';
import ApprovalsPage from './pages/ApprovalsPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminWorkflowsPage from './pages/AdminWorkflowsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminDepartmentsPage from './pages/AdminDepartmentsPage';

const ProtectedLayout = ({ children, pageTitle }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Initializing WorkFlowOS...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar onOpenNewRequest={() => setIsModalOpen(true)} pageTitle={pageTitle} />
        {React.cloneElement(children, { onOpenNewRequest: () => setIsModalOpen(true) })}
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Re-render or trigger custom reload if needed
          window.dispatchEvent(new Event('workflowos-request-created'));
        }}
      />
    </div>
  );
};

const AdminRoute = ({ children, pageTitle }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ProtectedLayout pageTitle={pageTitle}>{children}</ProtectedLayout>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedLayout pageTitle="Executive Dashboard">
                <DashboardPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/my-requests"
            element={
              <ProtectedLayout pageTitle="My Request Submissions">
                <MyRequestsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/requests/:id"
            element={
              <ProtectedLayout pageTitle="Request Lifecycle & Tracking">
                <RequestDetailPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/approvals"
            element={
              <ProtectedLayout pageTitle="Pending Approvals Queue">
                <ApprovalsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/approvals-history"
            element={
              <ProtectedLayout pageTitle="Authorization History">
                <ApprovalsPage />
              </ProtectedLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/requests"
            element={
              <AdminRoute pageTitle="Global Company Requests">
                <AdminRequestsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/workflows"
            element={
              <AdminRoute pageTitle="Approval Routing Pipelines">
                <AdminWorkflowsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute pageTitle="Staff & Directory Management">
                <AdminUsersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/departments"
            element={
              <AdminRoute pageTitle="Corporate Departments">
                <AdminDepartmentsPage />
              </AdminRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

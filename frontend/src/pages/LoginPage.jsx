import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ArrowRight, ShieldCheck, CheckCircle2, Lock, Mail, AlertCircle } from 'lucide-react';

const PRESET_USERS = [
  { label: 'Admin (System)', email: 'admin@workflowos.com', role: 'ROLE_ADMIN', title: 'System Administrator' },
  { label: 'IT Manager', email: 'it.manager@workflowos.com', role: 'ROLE_MANAGER', title: 'IT Infrastructure Manager' },
  { label: 'HR Dept Head', email: 'hr.head@workflowos.com', role: 'ROLE_DEPT_HEAD', title: 'Head of Human Resources' },
  { label: 'Finance Head', email: 'finance.head@workflowos.com', role: 'ROLE_DEPT_HEAD', title: 'Head of Finance / CFO' },
  { label: 'Alex (IT Employee)', email: 'alex.employee@workflowos.com', role: 'ROLE_EMPLOYEE', title: 'Senior Software Engineer' },
  { label: 'Sarah (Finance Analyst)', email: 'sarah.employee@workflowos.com', role: 'ROLE_EMPLOYEE', title: 'Financial Analyst' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('alex.employee@workflowos.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid corporate email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetEmail) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  return (
    <div className="login-container">
      {/* Left Corporate Banner */}
      <div className="login-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div className="brand-badge" style={{ width: 44, height: 44, fontSize: '1.25rem' }}>
              <Layers size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>WorkFlowOS</h1>
              <span style={{ fontSize: '0.8rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Corporate Request & Routing Engine
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Autonomous Multi-Level Approval Routing for Modern Enterprises
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', maxWidth: 520, lineHeight: 1.6 }}>
            Eliminate manual forwarding, lost requests, and communication bottlenecks. WorkFlowOS automatically routes purchase requisitions, leave requests, and reimbursements through corporate approval chains.
          </p>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} color="#60a5fa" />
              <span>Hierarchical multi-stage approval routing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} color="#60a5fa" />
              <span>Full cryptographic audit trail & timeline tracking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} color="#60a5fa" />
              <span>Role-based access control with JWT authentication</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          WorkFlowOS Enterprise Monolithic Core • Java 17 + Spring Boot 3 + MySQL + React
        </div>
      </div>

      {/* Right Login Form */}
      <div className="login-form-wrapper">
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Corporate Portal Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
            Sign in with your enterprise credentials to access your dashboard.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Corporate Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@workflowos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* 1-Click Demo Logins for Presentations */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <ShieldCheck size={16} color="#2563eb" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.04em' }}>
              Quick Demo Presets (1-Click Fill)
            </span>
          </div>

          <div className="preset-chip-grid">
            {PRESET_USERS.map((preset) => (
              <button
                key={preset.email}
                type="button"
                className="preset-chip"
                onClick={() => handleSelectPreset(preset.email)}
                style={{
                  backgroundColor: email === preset.email ? '#eff6ff' : '#f8fafc',
                  borderColor: email === preset.email ? '#2563eb' : '#e2e8f0',
                }}
              >
                <strong>{preset.label}</strong>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{preset.title}</span>
              </button>
            ))}
          </div>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
            Default password for all sample accounts: <code>password123</code>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

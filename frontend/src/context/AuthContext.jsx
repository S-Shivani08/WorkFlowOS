import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('workflowos_token');
    const savedUser = localStorage.getItem('workflowos_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('workflowos_token');
        localStorage.removeItem('workflowos_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      departmentCode: data.departmentCode,
      jobTitle: data.jobTitle,
    };

    localStorage.setItem('workflowos_token', data.token);
    localStorage.setItem('workflowos_user', JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('workflowos_token');
    localStorage.removeItem('workflowos_user');
    setUser(null);
    setToken(null);
  };

  const role = user?.role || '';
  const isAdmin = role === 'ROLE_ADMIN';
  const isDeptHead = role === 'ROLE_DEPT_HEAD';
  const isManager = role === 'ROLE_MANAGER';
  const isApprover = isAdmin || isDeptHead || isManager;
  const isEmployee = role === 'ROLE_EMPLOYEE';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        isDeptHead,
        isManager,
        isApprover,
        isEmployee,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

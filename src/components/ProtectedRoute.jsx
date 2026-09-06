import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleDefaultRoute = (role) => {
  if (role === 'farmer' || role === 'fpo') return '/farmer/dashboard';
  if (role === 'buyer') return '/buyer/dashboard';
  if (role === 'admin') return '/admin';
  return '/';
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={roleDefaultRoute(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Wait for AuthContext to finish checking token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user, or user is not an admin, redirect to home securely
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If they are an admin, render the child routes (e.g. AdminDashboard)
  return <Outlet />;
};

export default AdminRoute;

import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// ─── Centralized Route Definitions ───
// Every page in the app is registered here.
// Protected routes and role-based routes will be added later.

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (Step 6) */}
      {/* <Route element={<ProtectedRoute />}> */}
      {/*   <Route path="/bookings" element={<MyBookings />} /> */}
      {/* </Route> */}

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// ─── Simple 404 Page (will be enhanced later) ───
const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-8xl font-bold text-primary/20 font-heading">404</h1>
    <h2 className="text-2xl font-semibold text-dark mt-2 mb-3">Page Not Found</h2>
    <p className="text-gray mb-6 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/"
      className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
    >
      Go Home
    </a>
  </div>
);

export default AppRoutes;

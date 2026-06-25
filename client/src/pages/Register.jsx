import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, loading: isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Clear errors on mount
  useEffect(() => {
    setLocalError(null);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(formData);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setLocalError(err);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 shadow-card rounded-2xl p-10 text-center relative z-10">
          <FiCheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Registration Successful!</h2>
          <p className="text-gray mb-6">Your account has been created. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Background decoration */}
      <div className="absolute top-[10%] right-[-5%] w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[0%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      {/* Glassmorphic Card */}
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/50 shadow-hover rounded-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-dark mb-2">Create Account</h1>
          <p className="text-gray">Join SkyBook for faster booking and rewards</p>
        </div>

        {localError && (
          <div className="mb-6 p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm text-center">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-light mb-1.5" htmlFor="firstName">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-light">
                  <FiUser />
                </div>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-light/50 border border-gray-light/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-light mb-1.5" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                className="w-full px-4 py-2.5 bg-light/50 border border-gray-light/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-light mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-light">
                <FiMail />
              </div>
              <input
                id="email"
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-light/50 border border-gray-light/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-light mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-light">
                  <FiLock />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-light/50 border border-gray-light/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-light mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-light">
                  <FiLock />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-light/50 border border-gray-light/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 mt-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

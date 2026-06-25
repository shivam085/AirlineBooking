import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { MdFlightTakeoff } from 'react-icons/md';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Flights', path: '/flights' },
  { name: 'My Bookings', path: '/bookings' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ─── Logo ─── */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-lg p-2 group-hover:bg-primary-dark transition-colors duration-300">
              <MdFlightTakeoff className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-dark font-heading tracking-tight">
              Sky<span className="text-primary">Book</span>
            </span>
          </Link>

          {/* ─── Desktop Navigation ─── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray hover:text-dark hover:bg-gray-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* ─── Auth Buttons / User Menu (Desktop) ─── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {user.firstName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-dark">{user.firstName}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray truncate">
                      {user.email}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-dark hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray hover:text-dark transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ─── Mobile Menu Button ─── */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenuAlt3 className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 space-y-1 bg-white border-t border-gray-100">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray hover:text-dark hover:bg-gray-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {user.firstName.charAt(0)}
                  </div>
                  Logged in as {user.firstName}
                </div>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray hover:text-dark rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiUser className="text-lg" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg text-center transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

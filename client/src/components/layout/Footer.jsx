import { Link } from 'react-router-dom';
import { MdFlightTakeoff } from 'react-icons/md';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Main Footer Content ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <MdFlightTakeoff className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white font-heading tracking-tight">
                Sky<span className="text-primary">Book</span>
              </span>
            </Link>
            <p className="text-sm text-gray-light leading-relaxed mb-4">
              Book flights to 500+ destinations worldwide. Best prices, instant confirmation, 24/7 support.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-dark-light rounded-lg hover:bg-primary/20 hover:text-primary transition-all duration-200">
                <FaTwitter />
              </a>
              <a href="#" className="p-2 bg-dark-light rounded-lg hover:bg-primary/20 hover:text-primary transition-all duration-200">
                <FaLinkedin />
              </a>
              <a href="#" className="p-2 bg-dark-light rounded-lg hover:bg-primary/20 hover:text-primary transition-all duration-200">
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {['Search Flights', 'My Bookings', 'Flight Status', 'Help Center'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-light hover:text-primary transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-light hover:text-primary transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <FiMail className="text-primary shrink-0" />
                <span>support@skybook.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <FiPhone className="text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <FiMapPin className="text-primary shrink-0 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="border-t border-dark-light py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray">
            © {currentYear} SkyBook. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-xs text-gray hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="text-xs text-gray hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="text-xs text-gray hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

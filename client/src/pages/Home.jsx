import { Link } from 'react-router-dom';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineSearch } from 'react-icons/hi';
import { BsShieldCheck, BsCreditCard2Back, BsHeadset } from 'react-icons/bs';
import { FiArrowRight } from 'react-icons/fi';

const features = [
  {
    icon: <BsShieldCheck className="text-2xl" />,
    title: 'Secure Booking',
    description: 'Your payments and personal data are protected with bank-grade encryption.',
  },
  {
    icon: <BsCreditCard2Back className="text-2xl" />,
    title: 'Best Prices',
    description: 'We compare fares across airlines to guarantee you the lowest price every time.',
  },
  {
    icon: <BsHeadset className="text-2xl" />,
    title: '24/7 Support',
    description: 'Our support team is available around the clock to help with your travel needs.',
  },
];

const popularRoutes = [
  { from: 'Mumbai', to: 'Delhi', price: '₹3,499', code: 'BOM → DEL' },
  { from: 'Bangalore', to: 'Hyderabad', price: '₹2,199', code: 'BLR → HYD' },
  { from: 'Delhi', to: 'Goa', price: '₹4,299', code: 'DEL → GOI' },
  { from: 'Chennai', to: 'Kolkata', price: '₹3,899', code: 'MAA → CCU' },
];

const Home = () => {
  return (
    <div className="min-h-screen">

      {/* ════════════════ Hero Section ════════════════ */}
      <section className="relative bg-gradient-to-br from-dark via-dark-light to-primary-dark overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Live flight tracking available</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-6">
              Your Journey Starts
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary">
                With SkyBook
              </span>
            </h1>

            <p className="text-lg text-gray-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Search, compare, and book flights to 500+ destinations worldwide.
              Best prices guaranteed with instant confirmation.
            </p>

            {/* ─── Search Card (Placeholder — full build in Step 10) ─── */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* From */}
                <div className="bg-white/10 rounded-xl p-4 text-left hover:bg-white/15 transition-colors cursor-pointer">
                  <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
                    <MdFlightTakeoff className="text-primary-light" />
                    From
                  </label>
                  <p className="text-white font-semibold">Select City</p>
                </div>

                {/* To */}
                <div className="bg-white/10 rounded-xl p-4 text-left hover:bg-white/15 transition-colors cursor-pointer">
                  <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
                    <MdFlightLand className="text-primary-light" />
                    To
                  </label>
                  <p className="text-white font-semibold">Select City</p>
                </div>

                {/* Date */}
                <div className="bg-white/10 rounded-xl p-4 text-left hover:bg-white/15 transition-colors cursor-pointer">
                  <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
                    <HiOutlineCalendar className="text-primary-light" />
                    Departure
                  </label>
                  <p className="text-white font-semibold">Pick Date</p>
                </div>

                {/* Passengers */}
                <div className="bg-white/10 rounded-xl p-4 text-left hover:bg-white/15 transition-colors cursor-pointer">
                  <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
                    <HiOutlineUserGroup className="text-primary-light" />
                    Passengers
                  </label>
                  <p className="text-white font-semibold">1 Adult</p>
                </div>
              </div>

              {/* Search Button */}
              <button className="mt-6 w-full sm:w-auto px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 flex items-center justify-center gap-2 mx-auto cursor-pointer">
                <HiOutlineSearch className="text-lg" />
                Search Flights
              </button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
              fill="var(--color-light)"
            />
          </svg>
        </div>
      </section>

      {/* ════════════════ Features Section ════════════════ */}
      <section className="py-16 lg:py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark font-heading mb-3">
              Why Choose SkyBook?
            </h2>
            <p className="text-gray max-w-lg mx-auto">
              We make flight booking simple, secure, and affordable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-gray leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ Popular Routes ════════════════ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark font-heading mb-2">
                Popular Routes
              </h2>
              <p className="text-gray">Most booked flights this month</p>
            </div>
            <Link
              to="/flights"
              className="hidden sm:flex items-center gap-1.5 text-primary hover:text-primary-dark font-medium text-sm transition-colors"
            >
              View all routes
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray bg-light px-2.5 py-1 rounded-full">
                    {route.code}
                  </span>
                  <MdFlightTakeoff className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-dark mb-1">
                  {route.from} → {route.to}
                </h3>
                <p className="text-sm text-gray mb-3">Non-stop · 2h 15m</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{route.price}</span>
                  <span className="text-xs text-gray">starting from</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA Section ════════════════ */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-heading mb-4">
            Ready to Book Your Next Flight?
          </h2>
          <p className="text-primary-light/80 mb-8 max-w-lg mx-auto">
            Join thousands of travelers who trust SkyBook for their flight bookings.
            Sign up today and get exclusive deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-light transition-all duration-200 hover:shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/flights"
              className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Browse Flights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

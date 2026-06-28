import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const bookingId = location.state?.bookingId || 'N/A';

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-dark mb-2">Booking Confirmed!</h1>
        <p className="text-gray mb-6">
          Your flight ticket has been successfully booked. Have a great journey!
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-200">
          <p className="text-sm text-gray mb-1">Booking Reference ID:</p>
          <p className="font-mono font-medium text-dark break-all">{bookingId}</p>
        </div>

        <Link 
          to="/"
          className="block w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors shadow-md shadow-primary/20"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Success;

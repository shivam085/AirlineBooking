import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { BookingContext } from '../contexts/BookingContext';
import SeatMap from '../components/SeatMap';

const Checkout = () => {
  const { selectedFlight, passengers, selectedSeats } = useContext(BookingContext);

  // If a user refreshes the page or comes directly to /checkout without picking a flight,
  // we must redirect them back to the home page so the app doesn't crash!
  if (!selectedFlight) {
    return <Navigate to="/" />;
  }

  // Format date natively e.g. "Jun 27th, 2026"
  const formattedDate = new Date(selectedFlight.departureTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-dark">Complete Your Booking</h1>
        <p className="text-gray mt-2">
          {selectedFlight.departureAirport.city} to {selectedFlight.arrivalAirport.city} • {formattedDate}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Seat Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">1</span>
              Select Your Seats
            </h2>
            
            {/* The Interactive Seat Map! */}
            <SeatMap />
            
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">2</span>
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-light">
              <div className="flex justify-between">
                <span className="text-gray">Flight</span>
                <span className="font-medium">{selectedFlight.airline} {selectedFlight.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray">Passengers</span>
                <span className="font-medium">{passengers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray">Seats Selected</span>
                <span className="font-medium">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-semibold text-dark">Total</span>
              <span className="text-2xl font-bold text-primary">
                ₹{(selectedFlight.basePrice * passengers.length).toLocaleString('en-IN')}
              </span>
            </div>

            <button 
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedSeats.length !== passengers.length}
            >
              {selectedSeats.length !== passengers.length 
                ? `Select ${passengers.length} seats to continue` 
                : 'Proceed to Payment'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

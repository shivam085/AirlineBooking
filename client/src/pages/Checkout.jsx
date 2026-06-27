import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BookingContext } from '../contexts/BookingContext';
import { AuthContext } from '../contexts/AuthContext';
import SeatMap from '../components/SeatMap';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { selectedFlight, passengers, setPassengers, selectedSeats, resetBooking } = useContext(BookingContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedFlight) {
    return <Navigate to="/" />;
  }

  const formattedDate = new Date(selectedFlight.departureTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('You must be logged in to book a flight.');
      return;
    }

    // Validate passenger details
    for (const p of passengers) {
      if (!p.firstName || !p.lastName || !p.age) {
        toast.error('Please fill out all passenger details.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/bookings', {
        flightId: selectedFlight.id,
        passengers,
        seatNumbers: selectedSeats
      });
      
      toast.success('Booking Successful! Enjoy your flight.');
      resetBooking();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-dark">Complete Your Booking</h1>
        <p className="text-gray mt-2">
          {selectedFlight.departureAirport.city} to {selectedFlight.arrivalAirport.city} • {formattedDate}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Flow */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Seat Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">1</span>
              Select Your Seats
            </h2>
            <SeatMap />
          </div>

          {/* Step 2: Passenger Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">2</span>
              Passenger Details
            </h2>
            
            <div className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                  <h3 className="font-medium text-dark mb-4">Passenger {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={passenger.firstName || ''}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={passenger.lastName || ''}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input 
                        type="number" 
                        value={passenger.age || ''}
                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Age"
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">3</span>
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
              onClick={handleBooking}
              disabled={selectedSeats.length !== passengers.length || isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : (selectedSeats.length !== passengers.length 
                ? `Select ${passengers.length} seats to continue` 
                : 'Pay & Book'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

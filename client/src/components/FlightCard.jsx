import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFlightTakeoff } from 'react-icons/md';
import { BookingContext } from '../contexts/BookingContext';

const FlightCard = ({ flight, passengers }) => {
  const navigate = useNavigate();
  const { setSelectedFlight, setPassengers: setBookingPassengers } = useContext(BookingContext);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBook = () => {
    setSelectedFlight(flight);
    
    // Initialize empty passenger objects
    const count = parseInt(passengers || 1);
    const initialPassengers = Array.from({ length: count }, () => ({
      firstName: '',
      lastName: '',
      age: ''
    }));
    setBookingPassengers(initialPassengers);
    
    // Navigate to checkout (Phase 5)
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-hover transition-shadow border border-gray-100">
      
      {/* Airline Info */}
      <div className="flex flex-col items-center md:items-start w-full md:w-1/4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mb-2">
          {flight.airline.charAt(0)}
        </div>
        <h3 className="font-semibold text-dark text-lg">{flight.airline}</h3>
        <p className="text-sm text-gray">{flight.flightNumber}</p>
      </div>

      {/* Flight Timing */}
      <div className="flex items-center justify-center w-full md:w-2/4 gap-4">
        <div className="text-right">
          <p className="text-2xl font-bold text-dark">{formatTime(flight.departureTime)}</p>
          <p className="text-sm font-medium text-gray">{flight.departureAirport?.code}</p>
        </div>

        <div className="flex flex-col items-center flex-1 min-w-[100px]">
          <span className="text-xs text-gray mb-1">Non-stop</span>
          <div className="w-full flex items-center">
            <div className="w-2 h-2 rounded-full border-2 border-gray-300"></div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            <MdFlightTakeoff className="text-primary text-xl mx-2" />
            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-gray-300"></div>
          </div>
        </div>

        <div className="text-left">
          <p className="text-2xl font-bold text-dark">{formatTime(flight.arrivalTime)}</p>
          <p className="text-sm font-medium text-gray">{flight.arrivalAirport?.code}</p>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flex flex-col items-center md:items-end w-full md:w-1/4">
        <p className="text-2xl font-bold text-primary mb-1">₹{flight.basePrice}</p>
        <p className="text-sm text-gray mb-4">per adult</p>
        <button 
          onClick={handleBook}
          className="w-full md:w-auto px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-xl transition-colors shadow-md shadow-secondary/20 cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FlightCard;

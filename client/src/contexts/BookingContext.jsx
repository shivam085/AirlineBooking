import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const resetBooking = () => {
    setSelectedFlight(null);
    setPassengers([]);
    setSelectedSeats([]);
  };

  return (
    <BookingContext.Provider value={{
      selectedFlight, setSelectedFlight,
      passengers, setPassengers,
      selectedSeats, setSelectedSeats,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

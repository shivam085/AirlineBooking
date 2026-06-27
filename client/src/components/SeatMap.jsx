import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import { BookingContext } from '../contexts/BookingContext';
import { MdEventSeat } from 'react-icons/md';

const SeatMap = () => {
  const { socket } = useContext(SocketContext);
  const { selectedFlight, passengers, selectedSeats, setSelectedSeats } = useContext(BookingContext);
  
  // This tracks seats locked by *other* people in real-time
  const [lockedByOthers, setLockedByOthers] = useState([]);

  // Assuming an airplane with 6 seats per row (A,B,C - D,E,F)
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  const totalRows = Math.ceil(selectedFlight.totalSeats / 6);

  useEffect(() => {
    if (!socket) return;

    // 1. Tell the backend we are looking at THIS specific flight
    socket.emit('join_flight', selectedFlight.id);

    // 2. Listen for the initial list of already locked seats when we first join
    socket.on('initial_locked_seats', (seats) => {
      setLockedByOthers(seats);
    });

    // 3. Listen for real-time updates when ANYONE clicks a seat
    socket.on('seat_updated', ({ seatId, status }) => {
      if (status === 'locked') {
        setLockedByOthers((prev) => [...prev, seatId]);
      } else if (status === 'available') {
        setLockedByOthers((prev) => prev.filter((s) => s !== seatId));
      }
    });

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('initial_locked_seats');
      socket.off('seat_updated');
    };
  }, [socket, selectedFlight.id]);

  const handleSeatClick = (seatId) => {
    // If it's already locked by someone else, do nothing
    if (lockedByOthers.includes(seatId)) return;

    // If WE already selected it, clicking again will UNLOCK it
    if (selectedSeats.includes(seatId)) {
      const newSeats = selectedSeats.filter((s) => s !== seatId);
      setSelectedSeats(newSeats);
      socket.emit('unlock_seat', { flightId: selectedFlight.id, seatId });
      return;
    }

    // If we haven't selected it, check if we have enough passengers to pick another seat
    if (selectedSeats.length >= passengers.length) {
      alert(`You only have ${passengers.length} passenger(s)! Unselect a seat first.`);
      return;
    }

    // Otherwise, LOCK it!
    const newSeats = [...selectedSeats, seatId];
    setSelectedSeats(newSeats);
    socket.emit('lock_seat', { flightId: selectedFlight.id, seatId });
  };

  // Helper to figure out the CSS classes for a seat
  const getSeatStyle = (seatId) => {
    if (lockedByOthers.includes(seatId)) {
      return 'bg-gray-light text-gray cursor-not-allowed opacity-50'; // Taken by someone else
    }
    if (selectedSeats.includes(seatId)) {
      return 'bg-primary text-white shadow-md transform scale-110'; // Selected by YOU
    }
    return 'bg-white text-primary border border-primary/30 hover:border-primary hover:bg-primary/10 cursor-pointer'; // Available
  };

  return (
    <div className="flex flex-col items-center">
      {/* Cockpit Indicator */}
      <div className="w-64 h-24 border-t-[8px] border-x-[4px] border-gray-light rounded-t-full mb-8 relative bg-gray-50 flex items-center justify-center">
        <span className="text-gray font-semibold tracking-widest text-sm">FRONT</span>
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: totalRows }).map((_, rowIndex) => {
          const rowNumber = rowIndex + 1;
          
          return (
            <div key={`row-${rowNumber}`} className="flex items-center gap-2 sm:gap-6">
              {/* Row Number (Left) */}
              <div className="w-6 text-center text-gray font-semibold text-sm">{rowNumber}</div>
              
              <div className="flex gap-2">
                {columns.map((col, colIndex) => {
                  const seatId = `${rowNumber}${col}`;
                  
                  return (
                    <React.Fragment key={seatId}>
                      {/* Create the Aisle space between column C (index 2) and D (index 3) */}
                      {colIndex === 3 && <div className="w-4 sm:w-8" />} 
                      
                      <button
                        onClick={() => handleSeatClick(seatId)}
                        disabled={lockedByOthers.includes(seatId)}
                        className={`w-10 h-12 rounded-t-xl rounded-b-md flex flex-col items-center justify-center transition-all duration-200 ${getSeatStyle(seatId)}`}
                        title={seatId}
                      >
                        <MdEventSeat className="text-xl" />
                        <span className="text-[10px] font-medium mt-0.5">{col}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
              
              {/* Row Number (Right) */}
              <div className="w-6 text-center text-gray font-semibold text-sm">{rowNumber}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-12 pt-6 border-t border-gray-light w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white border border-primary/30"></div>
          <span className="text-sm text-gray">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary"></div>
          <span className="text-sm text-gray">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-light"></div>
          <span className="text-sm text-gray">Taken</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;

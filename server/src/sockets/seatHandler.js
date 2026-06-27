const { Booking } = require('../models');

/**
 * In-memory store for locked seats.
 * In a real production app with multiple servers, you would use Redis for this!
 * Structure: Map { "flightId_seatId" -> { socketId, timestamp } }
 */
const lockedSeats = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    
    // 1. User opens the Seat Map for a specific flight
    socket.on('join_flight', async (flightId) => {
      // socket.join() puts this user in a "Room" just for this flight
      socket.join(flightId);
      
      try {
        // Find permanently booked seats from the database
        const bookings = await Booking.findAll({ where: { flightId } });
        const permanentlyBooked = [];
        bookings.forEach(b => {
          if (b.seatNumbers) permanentlyBooked.push(...b.seatNumbers);
        });

        // Find temporarily locked seats in memory
        const currentlyLocked = [];
        for (const [key, value] of lockedSeats.entries()) {
          const [lockedFlightId, seatId] = key.split('_');
          if (lockedFlightId === flightId) {
            currentlyLocked.push(seatId);
          }
        }
        
        // Tell the user who just joined which seats are already locked
        // Combines permanent database locks with temporary socket locks
        socket.emit('initial_locked_seats', [...permanentlyBooked, ...currentlyLocked]);
      } catch (error) {
        console.error('Error fetching booked seats for socket:', error);
      }
    });

    // 2. User clicks on an empty seat
    socket.on('lock_seat', ({ flightId, seatId }) => {
      const lockKey = `${flightId}_${seatId}`;
      
      // If someone hasn't already locked it...
      if (!lockedSeats.has(lockKey)) {
        // Save it in our backend memory
        lockedSeats.set(lockKey, {
          socketId: socket.id,
          timestamp: Date.now()
        });

        // Broadcast to EVERYONE in this flight's room EXCEPT the sender
        socket.to(flightId).emit('seat_updated', { seatId, status: 'locked' });
      }
    });

    // 3. User clicks on a seat they already selected to unselect it
    socket.on('unlock_seat', ({ flightId, seatId }) => {
      const lockKey = `${flightId}_${seatId}`;
      const lockData = lockedSeats.get(lockKey);

      // Only allow unlocking if they are the person who locked it
      if (lockData && lockData.socketId === socket.id) {
        lockedSeats.delete(lockKey);
        socket.to(flightId).emit('seat_updated', { seatId, status: 'available' });
      }
    });

    // 4. User closes the tab or loses internet connection
    socket.on('disconnect', () => {
      // Loop through all locked seats and find any that belong to this specific user
      for (const [key, value] of lockedSeats.entries()) {
        if (value.socketId === socket.id) {
          // They disconnected, so free up their seat!
          lockedSeats.delete(key);
          
          const [flightId, seatId] = key.split('_');
          io.to(flightId).emit('seat_updated', { seatId, status: 'available' });
        }
      }
    });

  });
};

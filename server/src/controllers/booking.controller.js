const { Booking, Flight, sequelize } = require('../models');
const Razorpay = require('razorpay');

/**
 * Creates a new booking in the database using a Sequelize Transaction.
 * Validates seat capacity to prevent overbooking ("First successful booking wins").
 */
exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { flightId, passengers, seatNumbers } = req.body;
    const userId = req.user.id;

    // 1. Basic validation
    if (!flightId || !passengers || !seatNumbers || passengers.length === 0 || seatNumbers.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required booking details' });
    }

    if (passengers.length !== seatNumbers.length) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Number of passengers must match number of seats' });
    }

    // 2. Fetch the flight with a pessimistic lock to prevent concurrent overbooking
    const flight = await Flight.findByPk(flightId, { 
      transaction,
      lock: transaction.LOCK.UPDATE 
    });
    
    if (!flight) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Flight not found' });
    }

    // 3. Final Seat Capacity Validation
    // Fetch all existing bookings for this flight
    const existingBookings = await Booking.findAll({
      where: { flightId },
      transaction
    });

    let bookedSeatsCount = 0;
    const allBookedSeats = new Set();
    
    existingBookings.forEach(b => {
      // For pending payments, we should still lock the seats. 
      // If the payment fails later, we can cancel the booking.
      if (b.seatNumbers && b.bookingStatus !== 'cancelled') {
        bookedSeatsCount += b.seatNumbers.length;
        b.seatNumbers.forEach(seat => allBookedSeats.add(seat));
      }
    });

    // Check if flight is completely full
    if (bookedSeatsCount + seatNumbers.length > flight.totalSeats) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Not enough seats available on this flight.' });
    }

    // Check if the specific requested seats are already taken
    for (const seat of seatNumbers) {
      if (allBookedSeats.has(seat)) {
        await transaction.rollback();
        return res.status(400).json({ message: `Seat ${seat} has already been booked by someone else.` });
      }
    }

    // 4. Calculate total amount
    const totalAmount = flight.basePrice * passengers.length;

    // 5. Create Razorpay Order
    // Ensure you have RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mock'
    });

    const options = {
      amount: totalAmount * 100, // Razorpay amount is in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 6. Create the Booking inside the transaction
    const booking = await Booking.create({
      userId,
      flightId,
      passengers,
      seatNumbers,
      amount: totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'confirmed', // Keep confirmed but payment is pending
      paymentId: order.id // Temporarily store the order ID here
    }, { transaction });

    // 7. Commit the transaction (First successful booking wins!)
    await transaction.commit();

    res.status(201).json({
      message: 'Booking created, awaiting payment',
      booking,
      order // Send razorpay order to frontend
    });

  } catch (error) {
    if (error.name !== 'SequelizeUniqueConstraintError') {
      console.error('Error creating booking:', error);
    }
    // Automatically rollback on any unexpected errors
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to process booking' });
  }
};

/**
 * Gets all bookings for the currently authenticated user.
 */
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Flight,
          include: ['departureAirport', 'arrivalAirport']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};


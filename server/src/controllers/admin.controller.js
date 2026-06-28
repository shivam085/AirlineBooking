const { Flight, Booking, User } = require('../models');

// 1. Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalFlights = await Flight.count();
    const totalBookings = await Booking.count({ where: { paymentStatus: 'successful' } });
    const totalUsers = await User.count({ where: { role: 'user' } });
    
    // Calculate total revenue from successful bookings
    const successfulBookings = await Booking.findAll({ where: { paymentStatus: 'successful' } });
    const totalRevenue = successfulBookings.reduce((sum, booking) => sum + Number(booking.amount), 0);

    res.status(200).json({
      totalFlights,
      totalBookings,
      totalUsers,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// 1.5 Get All Flights
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll({
      include: ['departureAirport', 'arrivalAirport'],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(flights);
  } catch (error) {
    console.error('Error fetching all flights:', error);
    res.status(500).json({ message: 'Failed to fetch flights' });
  }
};

// 2. Create Flight
exports.createFlight = async (req, res) => {
  try {
    const { airline, flightNumber, departureAirportId, arrivalAirportId, departureTime, arrivalTime, basePrice, totalSeats } = req.body;

    if (!airline || !flightNumber || !departureAirportId || !arrivalAirportId || !departureTime || !arrivalTime || !basePrice || !totalSeats) {
      return res.status(400).json({ message: 'All flight details are required.' });
    }

    const flight = await Flight.create({
      airline,
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      basePrice,
      totalSeats
    });

    res.status(201).json({ message: 'Flight created successfully', flight });
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ message: 'Failed to create flight' });
  }
};

// 3. Update Flight
exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const flight = await Flight.findByPk(id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    await flight.update(updates);
    res.status(200).json({ message: 'Flight updated successfully', flight });
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({ message: 'Failed to update flight' });
  }
};

// 4. Delete Flight
exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await Flight.findByPk(id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    await flight.destroy();
    res.status(200).json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    res.status(500).json({ message: 'Failed to delete flight' });
  }
};

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /api/v1/bookings
// Protected route: You must be logged in to book a flight
router.post('/', authMiddleware, bookingController.createBooking);

// GET /api/v1/bookings/my-bookings
// Protected route: Get bookings for the logged-in user
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);

module.exports = router;

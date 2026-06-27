const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /api/v1/bookings
// Protected route: You must be logged in to book a flight
router.post('/', authMiddleware, bookingController.createBooking);

module.exports = router;

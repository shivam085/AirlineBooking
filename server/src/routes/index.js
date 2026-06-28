const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const flightRoutes = require('./flight.routes');
const airportRoutes = require('./airport.routes');
const bookingRoutes = require('./booking.routes');
const paymentRoutes = require('./payment.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

router.use('/flights', flightRoutes);
router.use('/airports', airportRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

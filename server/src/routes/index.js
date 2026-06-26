const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const flightRoutes = require('./flight.routes');
const airportRoutes = require('./airport.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

router.use('/flights', flightRoutes);
router.use('/airports', airportRoutes);
// router.use('/bookings', bookingRoutes);

module.exports = router;

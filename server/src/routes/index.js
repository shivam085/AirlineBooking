const { Router } = require('express');
const healthRoutes = require('./health.routes');

const router = Router();

router.use('/health', healthRoutes);

// Future routes will be added here:
// router.use('/auth', authRoutes);
// router.use('/flights', flightRoutes);
// router.use('/bookings', bookingRoutes);

module.exports = router;

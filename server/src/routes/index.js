const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Future routes will be added here:
// router.use('/flights', flightRoutes);
// router.use('/bookings', bookingRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const adminController = require('../controllers/admin.controller');

// Apply both middlewares to ALL admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/v1/admin/dashboard
router.get('/dashboard', adminController.getDashboardStats);

// GET /api/v1/admin/flights
router.get('/flights', adminController.getAllFlights);

// POST /api/v1/admin/flights
router.post('/flights', adminController.createFlight);

// PUT /api/v1/admin/flights/:id
router.put('/flights/:id', adminController.updateFlight);

// DELETE /api/v1/admin/flights/:id
router.delete('/flights/:id', adminController.deleteFlight);

module.exports = router;

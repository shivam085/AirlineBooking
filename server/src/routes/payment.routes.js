const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /api/v1/payments/verify
// Protected route: Verify the Razorpay payment signature
router.post('/verify', authMiddleware, paymentController.verifyPayment);

module.exports = router;

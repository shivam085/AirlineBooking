const crypto = require('crypto');
const { Booking, Flight, Airport, User } = require('../models');
const { sendEmail, bookingConfirmationMailgenContent } = require('../utils/mailer');

/**
 * Verifies the Razorpay payment signature and updates the booking status.
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // 1. Verify the signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mock';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      // Signature mismatch - payment verification failed
      await Booking.update(
        { paymentStatus: 'failed', bookingStatus: 'cancelled' },
        { where: { id: bookingId } }
      );
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // 2. Update the booking in database and eagerly load associated data for the email
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: User },
        { 
          model: Flight, 
          include: [
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' }
          ] 
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentId = razorpay_payment_id;
    booking.paymentStatus = 'successful';
    await booking.save();

    // 3. Send Confirmation Email
    if (booking.User && booking.User.email) {
      const emailContent = bookingConfirmationMailgenContent(booking.User.firstName, {
        airline: booking.Flight.airline,
        flightNumber: booking.Flight.flightNumber,
        departure: booking.Flight.departureAirport.city,
        arrival: booking.Flight.arrivalAirport.city,
        departureTime: booking.Flight.departureTime,
        seats: Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : booking.seatNumbers,
        amount: booking.amount
      });

      // Send email asynchronously in the background
      sendEmail({
        email: booking.User.email,
        subject: `Booking Confirmed: ${booking.Flight.flightNumber}`,
        mailgenContent: emailContent
      });
    }

    res.status(200).json({ 
      message: 'Payment verified successfully',
      booking
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal server error during payment verification' });
  }
};

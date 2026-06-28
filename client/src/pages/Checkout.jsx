import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BookingContext } from '../contexts/BookingContext';
import { AuthContext } from '../contexts/AuthContext';
import SeatMap from '../components/SeatMap';
import PassengerForm from '../components/PassengerForm';
import api from '../services/api';
import toast from 'react-hot-toast';

// Load Razorpay Script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { selectedFlight, passengers, setPassengers, selectedSeats, resetBooking } = useContext(BookingContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(res => {
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
      }
      setScriptLoaded(res);
    });
  }, []);

  if (!selectedFlight) {
    return <Navigate to="/" />;
  }

  const formattedDate = new Date(selectedFlight.departureTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const verifyPayment = async (response, bookingId) => {
    try {
      await api.post('/payments/verify', {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        bookingId: bookingId
      });
      
      toast.success('Payment verified successfully!');
      resetBooking();
      navigate('/success', { state: { bookingId } });
    } catch (error) {
      toast.error('Payment verification failed!');
      setIsSubmitting(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('You must be logged in to book a flight.');
      return;
    }

    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    // Validate passenger details
    for (const p of passengers) {
      if (!p.firstName || !p.lastName || !p.age) {
        toast.error('Please fill out all passenger details.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // 1. Create Booking & Order on Backend
      // NOTE: Our api.js interceptor automatically returns response.data
      const { order, booking } = await api.post('/bookings', {
        flightId: selectedFlight.id,
        passengers,
        seatNumbers: selectedSeats
      });

      // 2. Open Razorpay Widget
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock', // Fallback for dev mode without env
        amount: order.amount,
        currency: order.currency,
        name: "SkyBook Airlines",
        description: `Flight ${selectedFlight.airline} - ${selectedFlight.flightNumber}`,
        order_id: order.id,
        handler: function (response) {
          // 3. Verify Payment
          verifyPayment(response, booking.id);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3B82F6", // Tailwind primary blue
        },
        modal: {
          ondismiss: function() {
            toast.error("Payment was cancelled.");
            setIsSubmitting(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
        setIsSubmitting(false);
      });

      rzp1.open();
      
    } catch (error) {
      console.error('Checkout Error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to initialize booking';
      toast.error(`Error: ${errorMsg}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-dark">Complete Your Booking</h1>
        <p className="text-gray mt-2">
          {selectedFlight.departureAirport.city} to {selectedFlight.arrivalAirport.city} • {formattedDate}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">1</span>
              Select Your Seats
            </h2>
            <SeatMap />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">2</span>
              Passenger Details
            </h2>
            <PassengerForm passengers={passengers} handlePassengerChange={handlePassengerChange} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-light p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">3</span>
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-light">
              <div className="flex justify-between">
                <span className="text-gray">Flight</span>
                <span className="font-medium">{selectedFlight.airline} {selectedFlight.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray">Passengers</span>
                <span className="font-medium">{passengers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray">Seats Selected</span>
                <span className="font-medium">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-semibold text-dark">Total</span>
              <span className="text-2xl font-bold text-primary">
                ₹{(selectedFlight.basePrice * passengers.length).toLocaleString('en-IN')}
              </span>
            </div>

            <button 
              onClick={handleBooking}
              disabled={selectedSeats.length !== passengers.length || isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : (selectedSeats.length !== passengers.length 
                ? `Select ${passengers.length} seats to continue` 
                : 'Pay & Book'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

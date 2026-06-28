import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my-bookings');
        setBookings(response.bookings);
      } catch (error) {
        toast.error('Failed to fetch your bookings');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-xl text-gray">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-dark">My Bookings</h1>
          <p className="text-gray mt-2">Manage and view all your flight reservations.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-xl font-bold text-dark mb-2">No bookings found</h3>
            <p className="text-gray mb-6">You haven't booked any flights yet.</p>
            <button 
              onClick={() => navigate('/search')}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Search Flights
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    {/* Flight Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-dark text-lg">{booking.Flight.airline}</span>
                        <span className="bg-gray-100 text-gray text-xs font-medium px-2 py-1 rounded">
                          {booking.Flight.flightNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-dark font-medium">
                        <div className="text-center">
                          <p className="text-xl">{new Date(booking.Flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-sm text-gray">{booking.Flight.departureAirport.code}</p>
                        </div>
                        <div className="text-gray-300">⟶</div>
                        <div className="text-center">
                          <p className="text-xl">{new Date(booking.Flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-sm text-gray">{booking.Flight.arrivalAirport.code}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray mt-3">
                        {new Date(booking.Flight.departureTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Booking Status & Amount */}
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${booking.paymentStatus === 'successful' ? 'bg-green-100 text-green-700' : 
                          booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        Payment: {booking.paymentStatus}
                      </div>
                      <div className="text-2xl font-bold text-primary mt-2">
                        ₹{booking.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray mt-2">
                        <span className="font-medium">Seats:</span> {Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : booking.seatNumbers}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer with passengers */}
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <p className="text-xs text-gray font-medium uppercase tracking-wider mb-2">Passengers</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(booking.passengers) && booking.passengers.map((p, i) => (
                      <span key={i} className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm text-dark">
                        {p.firstName} {p.lastName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

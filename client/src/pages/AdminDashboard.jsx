import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalFlights: 0, totalBookings: 0, totalUsers: 0, totalRevenue: 0 });
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    airline: '', flightNumber: '', departureAirportId: '', arrivalAirportId: '', 
    departureTime: '', arrivalTime: '', basePrice: '', totalSeats: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, flightsData, airportsData] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/flights'), 
        api.get('/airports')
      ]);
      setStats(statsData);
      setFlights(flightsData);
      // The /airports endpoint returns { success: true, data: [...] }
      setAirports(airportsData.data || airportsData);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteFlight = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;
    try {
      await api.delete(`/admin/flights/${id}`);
      toast.success('Flight deleted successfully');
      setFlights(flights.filter(f => f.id !== id));
      setStats(s => ({ ...s, totalFlights: s.totalFlights - 1 }));
    } catch (error) {
      toast.error('Failed to delete flight');
    }
  };

  const handleSubmitFlight = async (e) => {
    e.preventDefault();
    try {
      if (editingFlightId) {
        await api.put(`/admin/flights/${editingFlightId}`, formData);
        toast.success('Flight updated successfully');
      } else {
        await api.post('/admin/flights', formData);
        toast.success('Flight created successfully');
      }
      setShowModal(false);
      setEditingFlightId(null);
      setFormData({ airline: '', flightNumber: '', departureAirportId: '', arrivalAirportId: '', departureTime: '', arrivalTime: '', basePrice: '', totalSeats: '' });
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || (editingFlightId ? 'Failed to update flight' : 'Failed to create flight'));
    }
  };

  const handleAddNewClick = () => {
    setEditingFlightId(null);
    setFormData({ airline: '', flightNumber: '', departureAirportId: '', arrivalAirportId: '', departureTime: '', arrivalTime: '', basePrice: '', totalSeats: '' });
    setShowModal(true);
  };

  const handleEditClick = (flight) => {
    setEditingFlightId(flight.id);
    
    // Format datetime for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateTime = (dateString) => {
      if (!dateString) return '';
      const d = new Date(dateString);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    setFormData({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureAirportId: flight.departureAirportId,
      arrivalAirportId: flight.arrivalAirportId,
      departureTime: formatDateTime(flight.departureTime),
      arrivalTime: formatDateTime(flight.arrivalTime),
      basePrice: flight.basePrice,
      totalSeats: flight.totalSeats
    });
    setShowModal(true);
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Stats */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-dark">Admin Dashboard</h1>
          <button onClick={handleAddNewClick} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            + New Flight
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray text-sm font-medium">Total Flights</p>
            <p className="text-3xl font-bold text-dark mt-2">{stats.totalFlights}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray text-sm font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-dark mt-2">{stats.totalBookings}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-dark mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
            <p className="text-gray text-sm font-medium">Total Revenue (INR)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Flight Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-dark">Manage Flights</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray font-semibold">
                  <th className="p-4">Flight</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Departure</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(flight => (
                  <tr key={flight.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-dark">{flight.airline}</p>
                      <p className="text-xs text-gray">{flight.flightNumber}</p>
                    </td>
                    <td className="p-4 text-sm text-dark font-medium">
                      {flight.departureAirport?.code} → {flight.arrivalAirport?.code}
                    </td>
                    <td className="p-4 text-sm text-gray">
                      {new Date(flight.departureTime).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-bold text-primary">
                      ₹{flight.basePrice}
                    </td>
                    <td className="p-4 flex gap-3">
                      <button onClick={() => handleEditClick(flight)} className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteFlight(flight.id)} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {flights.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray">No flights available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Create Flight Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-dark mb-6">{editingFlightId ? 'Edit Flight' : 'Create New Flight'}</h2>
            <form onSubmit={handleSubmitFlight} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Airline</label>
                <input required type="text" value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Indigo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Flight Number</label>
                <input required type="text" value={formData.flightNumber} onChange={e => setFormData({...formData, flightNumber: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. 6E-123" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Departure Airport</label>
                <select required value={formData.departureAirportId} onChange={e => setFormData({...formData, departureAirportId: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="">Select Airport</option>
                  {airports.map(a => <option key={a.id} value={a.id}>{a.city} ({a.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Arrival Airport</label>
                <select required value={formData.arrivalAirportId} onChange={e => setFormData({...formData, arrivalAirportId: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="">Select Airport</option>
                  {airports.map(a => <option key={a.id} value={a.id}>{a.city} ({a.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Departure Time</label>
                <input required type="datetime-local" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Arrival Time</label>
                <input required type="datetime-local" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Base Price (₹)</label>
                <input required type="number" min="0" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1">Total Seats</label>
                <input required type="number" min="1" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                  {editingFlightId ? 'Update Flight' : 'Create Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

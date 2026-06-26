import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineSearch } from 'react-icons/hi';
import api from '../services/api';

const SearchBar = () => {
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        // api.js interceptor already returns response.data,
        // so "response" here is actually { success, data }
        const response = await api.get('/airports');
        if (response.success) {
          setAirports(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch airports', error);
      }
    };
    fetchAirports();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to) {
      alert('Please select both departure and arrival airports.');
      return;
    }
    if (formData.from === formData.to) {
      alert('Departure and arrival airports cannot be the same.');
      return;
    }
    
    const dateParam = formData.date ? `&date=${formData.date}` : '';
    
    navigate(`/search?from=${formData.from}&to=${formData.to}${dateParam}&passengers=${formData.passengers}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* From */}
        <div className="bg-white/10 rounded-xl p-4 text-left transition-colors">
          <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
            <MdFlightTakeoff className="text-primary-light" />
            From
          </label>
          <select 
            name="from" 
            value={formData.from} 
            onChange={handleChange}
            className="w-full bg-transparent text-white font-semibold outline-none appearance-none cursor-pointer"
            required
          >
            <option value="" className="text-dark">Select City</option>
            {airports.map(airport => (
              <option key={airport.id} value={airport.id} className="text-dark">
                {airport.city} ({airport.code})
              </option>
            ))}
          </select>
        </div>

        {/* To */}
        <div className="bg-white/10 rounded-xl p-4 text-left transition-colors">
          <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
            <MdFlightLand className="text-primary-light" />
            To
          </label>
          <select 
            name="to" 
            value={formData.to} 
            onChange={handleChange}
            className="w-full bg-transparent text-white font-semibold outline-none appearance-none cursor-pointer"
            required
          >
            <option value="" className="text-dark">Select City</option>
            {airports.map(airport => (
              <option key={airport.id} value={airport.id} className="text-dark">
                {airport.city} ({airport.code})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="bg-white/10 rounded-xl p-4 text-left transition-colors">
          <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
            <HiOutlineCalendar className="text-primary-light" />
            Departure
          </label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-transparent text-white font-semibold outline-none cursor-pointer"
          />
        </div>

        {/* Passengers */}
        <div className="bg-white/10 rounded-xl p-4 text-left transition-colors">
          <label className="text-xs text-white/60 uppercase tracking-wider font-medium flex items-center gap-1.5 mb-1">
            <HiOutlineUserGroup className="text-primary-light" />
            Passengers
          </label>
          <select 
            name="passengers" 
            value={formData.passengers} 
            onChange={handleChange}
            className="w-full bg-transparent text-white font-semibold outline-none appearance-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num} className="text-dark">
                {num} {num === 1 ? 'Adult' : 'Adults'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="mt-6 w-full sm:w-auto px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 flex items-center justify-center gap-2 mx-auto cursor-pointer">
        <HiOutlineSearch className="text-lg" />
        Search Flights
      </button>
    </form>
  );
};

export default SearchBar;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdFlightTakeoff } from 'react-icons/md';
import { HiOutlineSearch } from 'react-icons/hi';
import api from '../services/api';
import FlightCard from '../components/FlightCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const passengers = searchParams.get('passengers') || 1;

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError('');
        // api.js interceptor already returns response.data,
        // so "response" here is actually { success, data }
        const response = await api.get(`/flights/search?from=${from}&to=${to}${date ? `&date=${date}` : ''}&passengers=${passengers}`);
        
        if (response.success) {
          setFlights(response.data);
        }
      } catch (err) {
        setError('Failed to fetch flights. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (from && to) {
      fetchFlights();
    } else {
      setLoading(false);
    }
  }, [from, to, date, passengers]);

  return (
    <div className="min-h-screen bg-light py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark font-heading">Search Results</h1>
            <p className="text-gray mt-1">
              Showing available flights for your selected route
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
            <HiOutlineSearch className="text-xl" />
            {flights.length} flights found
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-gray font-medium">Searching for best flights...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
            {error}
          </div>
        ) : flights.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <MdFlightTakeoff className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">No flights found</h3>
            <p className="text-gray max-w-md mx-auto">
              We couldn't find any flights matching your exact criteria. Try changing your dates or selecting a different airport.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {flights.map(flight => (
              <FlightCard key={flight.id} flight={flight} passengers={passengers} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

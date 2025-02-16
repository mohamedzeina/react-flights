'use client';

import React, { useState } from 'react';
import FlightResults from '../components/FlightResults';
import FlightSearch from '../components/FlightSearch';
import { fetchFlights } from '../lib/api';
import './globals.css';

const IndexPage = () => {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState(null); // Stores flight results
  const [searchPerformed, setSearchPerformed] = useState(false); // Tracks if search was triggered

  const handleSearch = async ({
    originSkyId,
    destinationSkyId,
    originEntityId,
    destinationEntityId,
    departureDate,
    returnDate,
    cabinClass,
    passengers,
  }) => {
    setLoading(true);
    setSearchPerformed(true); // Mark that a search has been performed
    setFlights(null); // Reset previous results

    try {
      const results = await fetchFlights({
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        departureDate,
        returnDate,
        cabinClass,
        passengers,
      });

      setFlights(results.context ? results : []); // Store flight results (empty array if no results)
    } catch (error) {
      console.error('Error fetching flights:', error);
      alert('Error fetching flight data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
      {/* Title */}
      <h1 className="text-5xl font-bold mb-6 text-blue-300 drop-shadow-lg">
        ✈️ React Flights
      </h1>

      {/* Flight Search Component */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <FlightSearch onSearch={handleSearch} />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* No Flights Found */}
      {searchPerformed && flights?.length === 0 && (
        <p className="text-center text-red-500 mt-4">
          No flights found. Please try a different search.
        </p>
      )}

      {/* Flight Results */}
      {flights && flights.context && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
          <FlightResults flightResponse={flights} />
        </div>
      )}
    </div>
  );
};

export default IndexPage;

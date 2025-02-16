'use client';

import React, { useState } from 'react';
import { searchAirports } from '../lib/api';

const FlightSearch = ({ onSearch }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [originSkyId, setOriginSkyId] = useState('');
  const [destinationSkyId, setDestinationSkyId] = useState('');
  const [originEntityId, setOriginEntityId] = useState('');
  const [destinationEntityId, setDestinationEntityId] = useState('');

  // Debounce timeout identifiers for origin and destination search
  const [originTimeout, setOriginTimeout] = useState(null);
  const [destinationTimeout, setDestinationTimeout] = useState(null);

  const [dropdownVisibleOrigin, setDropdownVisibleOrigin] = useState(false);
  const [dropdownVisibleDestination, setDropdownVisibleDestination] =
    useState(false);

  // Passenger state
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleAirportSearch = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const results = await searchAirports(query);
    setSuggestions(results);
    setLoading(false);
  };

  const handleOriginChange = (e) => {
    const value = e.target.value;
    setOrigin(value);
    setDropdownVisibleOrigin(true);

    // Clear previous timeout
    if (originTimeout) clearTimeout(originTimeout);

    // Set new timeout to call search after delay (debounce)
    setOriginTimeout(
      setTimeout(() => {
        handleAirportSearch(value, setOriginSuggestions); // Search after 300ms
      }, 300)
    );
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setDropdownVisibleDestination(true);

    // Clear previous timeout
    if (destinationTimeout) clearTimeout(destinationTimeout);

    // Set new timeout to call search after delay (debounce)
    setDestinationTimeout(
      setTimeout(() => {
        handleAirportSearch(value, setDestinationSuggestions); // Search after 300ms
      }, 300)
    );
  };

  const handlePassengerChange = (type, operation) => {
    setPassengers((prev) => {
      const newValue =
        operation === 'increase' ? prev[type] + 1 : Math.max(0, prev[type] - 1);

      if (type === 'adults' && newValue < 1) return prev; // Ensure at least 1 adult
      return { ...prev, [type]: newValue };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate || !returnDate) {
      alert('Please fill out all fields.');
      return;
    }

    onSearch({
      originSkyId,
      destinationSkyId,
      originEntityId,
      destinationEntityId,
      departureDate,
      returnDate,
      cabinClass,
      passengers,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Where from?"
          value={origin}
          onChange={handleOriginChange}
          className="input-field"
          required
        />
        {originSuggestions.length > 0 && dropdownVisibleOrigin && (
          <ul className="dropdown">
            {originSuggestions.map((airport, index) => (
              <li
                key={index}
                className="dropdown-item"
                onClick={() => {
                  setOrigin(airport.presentation.suggestionTitle);
                  setOriginSkyId(airport.navigation.relevantFlightParams.skyId);
                  setOriginEntityId(airport.navigation.entityId);
                  setDropdownVisibleOrigin(false);
                }}
              >
                {airport.presentation.suggestionTitle}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Where to?"
          value={destination}
          onChange={handleDestinationChange}
          className="input-field"
          required
        />
        {destinationSuggestions.length > 0 && dropdownVisibleDestination && (
          <ul className="dropdown">
            {destinationSuggestions.map((airport, index) => (
              <li
                key={index}
                className="dropdown-item"
                onClick={() => {
                  setDestination(airport.presentation.suggestionTitle);
                  setDestinationSkyId(
                    airport.navigation.relevantFlightParams.skyId
                  );
                  setDestinationEntityId(airport.navigation.entityId);
                  setDropdownVisibleDestination(false);
                }}
              >
                {airport.presentation.suggestionTitle}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Departure Date</label>
        <input
          type="date"
          value={departureDate}
          min={today}
          onChange={(e) => {
            setDepartureDate(e.target.value);
            if (new Date(e.target.value) > new Date(returnDate)) {
              setReturnDate('');
            }
          }}
          className="input-field"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Return Date</label>
        <input
          type="date"
          value={returnDate}
          min={departureDate || today}
          onChange={(e) => setReturnDate(e.target.value)}
          className="input-field"
          required
        />
      </div>

      {/* Cabin Class Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700">Cabin Class</label>
        <select
          value={cabinClass}
          onChange={(e) => setCabinClass(e.target.value)}
          className="input-field"
        >
          <option value="economy">Economy</option>
          <option value="premium_economy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
      </div>

      {/* Passenger Selector */}
      <div className="relative mb-4">
        <label className="block text-gray-700">Passengers</label>
        <button
          type="button"
          className="input-field text-left"
          onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
        >
          {passengers.adults} Adults, {passengers.children} Children,{' '}
          {passengers.infants} Infants
        </button>

        {showPassengerDropdown && (
          <div className="absolute left-0 w-full bg-white shadow-lg rounded-lg p-4 border mt-2 z-10">
            {[
              { label: 'Adults', key: 'adults' },
              { label: 'Children (2-11)', key: 'children' },
              { label: 'Infants', key: 'infants' },
            ].map(({ label, key }) => (
              <div
                key={key}
                className="flex justify-between items-center py-2 border-b"
              >
                <span className="text-gray-800">{label}</span>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center"
                    onClick={() => handlePassengerChange(key, 'decrease')}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {passengers[key]}
                  </span>
                  <button
                    type="button"
                    className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center"
                    onClick={() => handlePassengerChange(key, 'increase')}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-3">
              <button
                className="text-blue-500"
                onClick={() => setShowPassengerDropdown(false)}
              >
                Cancel
              </button>
              <button
                className="text-blue-600 font-bold"
                onClick={() => setShowPassengerDropdown(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary w-full">
        Search Flights
      </button>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </form>
  );
};

export default FlightSearch;

'use client';

import { useState } from 'react';

function ConvertMinutes(num) {
  let d = Math.floor(num / 1440); // 60*24
  let h = Math.floor((num - d * 1440) / 60);
  let m = Math.round(num % 60);

  if (d > 0) {
    return `${d} days, ${h} hours, ${m} minutes`;
  } else {
    return `${h} hours, ${m} minutes`;
  }
}

const FlightResults = ({ flightResponse }) => {
  let tempFlights = [];

  for (let i = 0; i < flightResponse.itineraries.length; i++) {
    for (let j = 0; j < flightResponse.itineraries[i].legs.length; j++) {
      let flightData = flightResponse.itineraries[i].legs[j];
      let f = {
        carrierName: flightData.carriers.marketing[0].name,
        carrierLogo: flightData.carriers.marketing[0].logoUrl,
        departure: flightData.departure.split('T')[1],
        arrival: flightData.arrival.split('T')[1],
        price: flightResponse.itineraries[i].price.formatted,
        duration: ConvertMinutes(flightData.durationInMinutes),
      };

      tempFlights.push(f);
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const totalPages = Math.ceil(tempFlights.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedFlights = tempFlights.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-5xl font-bold mb-6 text-black drop-shadow-lg">
        Flight Results
      </h1>

      {paginatedFlights.length > 0 ? (
        <>
          {/* Flight List */}
          <div className="grid gap-6">
            {paginatedFlights.map((flight, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Airline Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={flight.carrierLogo}
                    alt={flight.carrierName}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{flight.carrierName}</h3>
                    <p className="text-sm text-gray-500">{flight.duration}</p>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="text-center">
                  <p className="text-gray-700">
                    <span className="font-semibold">Departure:</span>{' '}
                    {flight.departure}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Arrival:</span>{' '}
                    {flight.arrival}
                  </p>
                </div>

                {/* Price */}
                <p className="text-lg font-semibold text-blue-600">
                  {flight.price}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination (Only Show if More Than One Page) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white'
                }`}
              >
                Previous
              </button>

              <span className="text-lg text-gray-900 font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">No flights found.</p>
      )}
    </div>
  );
};

export default FlightResults;

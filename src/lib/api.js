import axios from 'axios';

const FLIGHT_URL =
  'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights'; // Endpoint for flight search
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY; // API key

const AIRPORT_URL =
  'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport'; // Endpoint for airport search

// Function to fetch flight data
const fetchFlights = async ({
  originSkyId,
  destinationSkyId,
  originEntityId,
  destinationEntityId,
  departureDate,
  returnDate,
  cabinClass,
  passengers,
}) => {
  try {
    const response = await axios.get(FLIGHT_URL, {
      params: {
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        date: departureDate, // Departure date in format YYYY-MM-DD
        returnDate: returnDate, // Return date in format YYYY-MM-DD
        sortBy: 'best',
        cabinClass: cabinClass,
        adults: passengers['adults'],
        childrens: passengers['children'],
        infants: passengers['infants'],
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
      },
    });

    // Check for results and return them
    if (response.data && response.data.data) {
      return response.data.data; // Returns the flight details
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
};

const searchAirports = async (query) => {
  try {
    const response = await axios.get(AIRPORT_URL, {
      params: {
        query,
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
      },
    });

    // Return a list of airports (e.g., name, code)
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
};

export { fetchFlights, searchAirports };

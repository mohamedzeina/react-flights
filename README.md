# React Flights App ✈️

A simple and user-friendly flight search application built with React, allowing users to search for flights based on their travel preferences.

## Features

- Search flights by origin, destination, departure, and return dates.
- Select cabin class (Economy, Premium Economy, Business, First).
- Select the number of passengers (Adults, Children, Infants).
- View real-time flight results.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamedzeina/react-flights.git
   ```
2. Navigate to the project folder:
   ```bash
   cd react-flights
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure local environment variables in .env.local:
   ```bash
   NEXT_PUBLIC_RAPIDAPI_KEY="YOUR RAPID API KEY"
    ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Enter departure and arrival locations.
2. Select travel dates and cabin class.
3. Choose the number of passengers.
4. Click "Search Flights" to view available options.

## API Integration

This project leverages the Air Scraper API from RapidAPI to fetch real-time flight data.
To use the API, follow these steps:

1. Sign up at RapidAPI.
2. Subscribe to the Air Scraper API.
3. Obtain your API key and add it to the environment vairables

## Technologies Used

- React.js
- Tailwind CSS
- Air Scraper API (RapidAPI)

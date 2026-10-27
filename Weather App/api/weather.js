// api/weather.js
export default async function handler(request, response) {
  // 1. Get the city or coordinates from the frontend request
  const { city, lat, lon } = request.query;
  
  // 2. Get the secret key from Vercel's Environment Variables
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'Server misconfiguration: API key missing.' });
  }

  // 3. Determine which OpenWeatherMap URL to call
  let apiUrl;
  if (city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    return response.status(400).json({ error: 'Please provide a city name or coordinates.' });
  }

  try {
    // 4. Fetch data from OpenWeatherMap
    const apiResponse = await fetch(apiUrl);
    
    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({ error: 'City not found. Please check the spelling.' });
    }
    
    const data = await apiResponse.json();
    
    // 5. Send the data back to your frontend
    return response.status(200).json(data);
    
  } catch (error) {
    return response.status(500).json({ error: 'Failed to fetch weather data.' });
  }
}
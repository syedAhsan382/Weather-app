
export default async function handler(request, response) {
  // Get the city or coordinates from the frontend request
  const { city, lat, lon } = request.query;
  
  // API key 
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'Server misconfiguration: API key missing.' });
  }

  // OpenWeatherMap URL to call
  let apiUrl;
  if (city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    return response.status(400).json({ error: 'Please provide a city name or coordinates.' });
  }

  try {
    // Fetching data from OpenWeatherMap
    const apiResponse = await fetch(apiUrl);
    
    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({ error: 'City not found. Please check the spelling.' });
    }
    
    const data = await apiResponse.json();
    
    // Send the data back to frontend
    return response.status(200).json(data);
    
  } catch (error) {
    return response.status(500).json({ error: 'Failed to fetch weather data.' });
  }
}
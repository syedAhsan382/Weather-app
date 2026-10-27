// Made weatherType matching case-insensitive for safety
function getBackground(weatherType) {
  const type = weatherType.toLowerCase();
  
  if (type === "clear") return "Images/clear.jpg";
  if (type === "clouds") return "Images/clouds.jpg";
  if (type === "rain" || type === "drizzle") return "Images/Rainy.jpg";
  if (type === "thunderstorm") return "Images/thunderstorm.jpg";
  if (type === "snow") return "Images/snowing.jpg";
  if (type === "mist" || type === "fog" || type === "haze") return "Images/mist.jpg";
  
  return "Images/default.png";
}


// GetWeather function fetch weather using API key
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const result = document.getElementById("weatherResult");

  if (city === "") {
    result.textContent = "Please enter a city name";
    result.style.color = "red";
    return;
  }

  result.textContent = "Loading...";
  result.style.color = "black";

  // Backend proxy, no API key needed here!
  const url = `/api/weather?city=${encodeURIComponent(city)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Handle errors returned by our proxy
    if (!response.ok) {
      throw new Error(data.error || "City not found");
    }

    // Data Extraction and innerHTML logic
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const weatherType = data.weather[0].main;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // This fetches the background Images according to weatherType
    const image = getBackground(weatherType);
    document.body.style.background = `url('${image}') center/cover no-repeat`;

    result.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="${iconUrl}" alt="${description}">
      <p><strong>${temp}°C</strong></p>
      <p style="text-transform: capitalize;">${description}</p>
    `;
  } catch (error) {
    result.textContent = error.message;
    result.style.color = "red";
    document.body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
  }
}

// Function gets the location of the user device to get its current location
function getLocationWeather() {
  const result = document.getElementById("weatherResult");
  
  if (!navigator.geolocation) {
    result.textContent = "Geolocation is not supported by your browser.";
    result.style.color = "red";
    return;
  }

  result.textContent = "Locating...";
  result.style.color = "black";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      // Point to backend proxy with coordinates
      const url = `/api/weather?lat=${lat}&lon=${lon}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to fetch weather for your location.");
        }
        
        document.getElementById("cityInput").value = data.name; 
        
        // Display logic 
        const temp = Math.round(data.main.temp); //Temperature
        const description = data.weather[0].description; // Description
        const weatherType = data.weather[0].main; // Weather Type 
        const icon = data.weather[0].icon; // Weather Icon
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // Icon fetching from OpenWeather website


        const image = getBackground(weatherType);
        document.body.style.background = `url('${image}') center/cover no-repeat`;

        result.innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <img src="${iconUrl}" alt="${description}">
          <p><strong>${temp}°C</strong></p>
          <p style="text-transform: capitalize;">${description}</p>`;

      } catch (error) {
        result.textContent = error.message;
        result.style.color = "red";
      }
    },
    () => {
      result.textContent = "Unable to retrieve your location. Please allow location access.";
      result.style.color = "red";
    }
  );
}

// Press Enter to search
document.getElementById("cityInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
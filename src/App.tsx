import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number | null, lon: number | null }>({ lat: null, lon: null });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lon: longitude });
    });
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      const fetchWeather = async () => {
        try {
          const cacheKey = `weather_${location.lat}_${location.lon}`;
          const cachedData = localStorage.getItem(cacheKey);
          const now = new Date().getTime();

          if (cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (now - timestamp < 10 * 60 * 1000) { // 10 minutes cache
              setWeather(data);
              return;
            }
          }

          const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall`, {
            params: {
              lat: location.lat,
              lon: location.lon,
              appid: 'c6dea39f86ea31dc114f0a4f0eec8fa9',
            },
          });
          setWeather(response.data);
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: response.data }));
        } catch (error) {
          console.error('Error fetching weather data', error);
        }
      };
      fetchWeather();
    }
  }, [location]);

  return (
    <div className="weather-app">
      {weather ? (
        <div>
          <h1>Weather</h1>
          <p>Temperature: {weather.current.temp}°K</p>
          <p>Weather: {weather.current.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import './App.css';

const API_KEY = 'c6dea39f86ea31dc114f0a4f0eec8fa9';
const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (err) => {
        setError('Failed to get location');
        setLoading(false);
      }
    );
  }, []);

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    const cacheKey = `${latitude},${longitude}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}_time`);

    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < CACHE_EXPIRATION) {
      setWeatherData(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="App-header">Loading...</div>;
  }

  if (error) {
    return <div className="App-header">{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        {weatherData && (
          <div className="weather-container">
            <div className="weather-card">
              <h2>{weatherData.current.temp}°C</h2>
              <p>{weatherData.current.weather[0].description}</p>
            </div>
            <div className="weather-card">
              <h3>Location: {weatherData.lat}, {weatherData.lon}</h3>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;


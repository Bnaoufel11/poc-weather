import React, { useEffect, useState } from 'react';
import './Weather.css';  

interface WeatherProps {
  latitude: number;
  longitude: number;
}

const API_KEY = 'c6dea39f86ea31dc114f0a4f0eec8fa9';
const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

const Weather: React.FC<WeatherProps> = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData(latitude, longitude);
  }, [latitude, longitude]);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="weather-container">
      {weatherData && (
        <>
          <div className="weather-card">
            <h2>{weatherData.current.temp}°C</h2>
            <p>{weatherData.current.weather[0].description}</p>
          </div>
          <div className="weather-card">
            <h3>Location: {weatherData.lat}, {weatherData.lon}</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;

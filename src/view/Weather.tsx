import { useEffect, useState } from "react";
import axios from 'axios';

const API_KEY = "c6dea39f86ea31dc114f0a4f0eec8fa9"; // Replace with your actual API key

export const Weather = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getWeather = async (city: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: city,
                    appid: API_KEY,
                    units: 'metric',
                }
            });
            setWeather(response.data);
        } catch (err) {
            setError("Error fetching weather data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (city) {
            getWeather(city);
        }
    }, [city]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem("city") as HTMLInputElement;
        setCity(input.value);
    }

    return (
        <div className="weather-app">
            <form onSubmit={handleSubmit}>
                <input type="text" name="city" placeholder="Enter city" />
                <button type="submit">Get Weather</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {weather && (
                <div>
                    <h2>{weather.name}</h2>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                </div>
            )}
        </div>
    );
};

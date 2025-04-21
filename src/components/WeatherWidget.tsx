import React, { useEffect, useState } from 'react';
import { Sun, CloudRain, Loader2 } from 'lucide-react';
import { getWeather, WeatherData } from '../api/weather';

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getWeather();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Unable to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-4 text-white">
        <CloudRain className="w-6 h-6 text-white mr-2" />
        <span>Weather data unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <img
        src={`https://openweathermap.org/img/wn/${weather?.icon}@2x.png`}
        alt={weather?.description}
        className="w-10 h-10"
      />
      <div className="text-white">
        <span className="font-semibold">{weather?.temp}°F</span>
        <span className="mx-2">|</span>
        <span className="capitalize">{weather?.description}</span>
      </div>
    </div>
  );
}
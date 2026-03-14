import { useEffect, useState } from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Loader2,
  Snowflake,
  Sun,
  type LucideIcon
} from 'lucide-react';
import { getWeather, WeatherData } from '../api/weather';

const iconMap: Record<string, LucideIcon> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning
};

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
        <Loader2 className="w-6 h-6 text-on-surface-variant animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-4 text-on-surface-variant">
        <CloudRain className="w-6 h-6 text-on-surface-variant mr-2" />
        <span>Weather data unavailable</span>
      </div>
    );
  }

  const WeatherIcon = weather?.icon ? iconMap[weather.icon] ?? CloudRain : CloudRain;

  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <WeatherIcon className="w-10 h-10 text-amber-500" />
      <div className="text-on-surface-variant">
        <span className="font-semibold">{weather?.temp}°F</span>
        <span className="mx-2">|</span>
        <span className="capitalize">{weather?.description}</span>
      </div>
    </div>
  );
}

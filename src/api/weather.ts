import { siteConfig } from '../config/site';

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

function mapWeatherCode(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'Clear sky', icon: 'Sun' };
  if (code === 1) return { description: 'Mainly clear', icon: 'Sun' };
  if (code === 2) return { description: 'Partly cloudy', icon: 'CloudSun' };
  if (code === 3) return { description: 'Overcast', icon: 'Cloud' };
  if (code >= 45 && code <= 48) return { description: 'Fog', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { description: 'Drizzle', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { description: 'Rain', icon: 'CloudRain' };
  if (code >= 66 && code <= 67) return { description: 'Freezing rain', icon: 'CloudHail' };
  if (code >= 71 && code <= 77) return { description: 'Snow', icon: 'CloudSnow' };
  if (code >= 80 && code <= 82) return { description: 'Rain showers', icon: 'CloudRain' };
  if (code >= 85 && code <= 86) return { description: 'Snow showers', icon: 'Snowflake' };
  if (code >= 95 && code <= 99) return { description: 'Thunderstorm', icon: 'CloudLightning' };
  return { description: 'Weather', icon: 'CloudRain' };
}

export async function getWeather(): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${siteConfig.weather.lat}&longitude=${siteConfig.weather.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit`
    );

    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data = (await response.json()) as OpenMeteoResponse;
    const { description, icon } = mapWeatherCode(data.current.weather_code);

    return {
      temp: Math.round(data.current.temperature_2m),
      description,
      icon
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

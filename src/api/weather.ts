import { siteConfig } from '../config/site';

const API_KEY = '3ce60b5f72624df49cbfd96ac728fe65';

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

export async function getWeather(): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${siteConfig.weather.lat}&lon=${siteConfig.weather.lon}&appid=${API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data = await response.json();
    
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

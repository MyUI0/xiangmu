import React from 'react';
import { ForecastDay } from '@/types/weather';
import { Cloud, Sun, CloudRain, Snowflake, CloudFog, CloudLightning } from 'lucide-react';

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

const getWeatherIcon = (icon: string) => {
  switch (icon) {
    case 'sunny':
      return <Sun className="w-8 h-8 text-yellow-400" />;
    case 'cloudy':
    case 'foggy':
      return <Cloud className="w-8 h-8 text-gray-400" />;
    case 'rainy':
    case 'drizzle':
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    case 'snowy':
      return <Snowflake className="w-8 h-8 text-blue-200" />;
    case 'thunderstorm':
      return <CloudLightning className="w-8 h-8 text-purple-400" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-400" />;
  }
};

export default function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">7天预报</h2>
      <div className="grid grid-cols-7 gap-2">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/50 transition-colors"
          >
            <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
            <div className="mb-2">{getWeatherIcon(day.icon)}</div>
            <div className="text-lg font-semibold text-gray-700">{day.maxTemp}°</div>
            <div className="text-sm text-gray-500">{day.minTemp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

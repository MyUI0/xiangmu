import React from 'react';
import { WeatherData } from '@/types/weather';
import { Droplets, Wind, Gauge, Sun, Eye } from 'lucide-react';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export default function WeatherDetails({ weather }: WeatherDetailsProps) {
  const details = [
    {
      icon: <Droplets className="w-6 h-6 text-blue-400" />,
      label: '湿度',
      value: `${weather.humidity}%`,
    },
    {
      icon: <Wind className="w-6 h-6 text-cyan-400" />,
      label: '风速',
      value: `${weather.windSpeed} km/h`,
    },
    {
      icon: <Gauge className="w-6 h-6 text-purple-400" />,
      label: '气压',
      value: `${weather.pressure} hPa`,
    },
    {
      icon: <Sun className="w-6 h-6 text-yellow-400" />,
      label: '紫外线',
      value: weather.uvIndex.toString(),
    },
    {
      icon: <Eye className="w-6 h-6 text-green-400" />,
      label: '能见度',
      value: `${weather.visibility} km`,
    },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">详细信息</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-2xl bg-white/50"
          >
            <div className="mb-2">{detail.icon}</div>
            <div className="text-sm text-gray-500 mb-1">{detail.label}</div>
            <div className="text-lg font-semibold text-gray-700">{detail.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 rounded-2xl bg-white/50 text-center">
        <div className="text-sm text-gray-500 mb-1">体感温度</div>
        <div className="text-2xl font-semibold text-gray-700">{weather.feelsLike}°C</div>
      </div>
    </div>
  );
}

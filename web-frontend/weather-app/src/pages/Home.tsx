import React, { useEffect } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import SearchBar from '@/components/SearchBar';
import WeatherAnimation from '@/components/WeatherAnimation';
import WeatherForecast from '@/components/WeatherForecast';
import WeatherDetails from '@/components/WeatherDetails';
import { Cloud, Sun, CloudRain, Snowflake, CloudFog, CloudLightning } from 'lucide-react';

const getWeatherIconComponent = (icon: string) => {
  switch (icon) {
    case 'sunny':
      return <Sun className="w-24 h-24 text-yellow-400" />;
    case 'cloudy':
    case 'foggy':
      return <Cloud className="w-24 h-24 text-gray-400" />;
    case 'rainy':
    case 'drizzle':
      return <CloudRain className="w-24 h-24 text-blue-400" />;
    case 'snowy':
      return <Snowflake className="w-24 h-24 text-blue-200" />;
    case 'thunderstorm':
      return <CloudLightning className="w-24 h-24 text-purple-400" />;
    default:
      return <Sun className="w-24 h-24 text-yellow-400" />;
  }
};

export default function Home() {
  const { weather, loading, error, fetchWeatherByLocation } = useWeatherStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=zh&format=json`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const city = data.results[0];
              fetchWeatherByLocation(latitude, longitude, city.name, city.country);
            } else {
              fetchWeatherByLocation(latitude, longitude, '北京', '中国');
            }
          } catch {
            fetchWeatherByLocation(39.9042, 116.4074, '北京', '中国');
          }
        },
        () => {
          fetchWeatherByLocation(39.9042, 116.4074, '北京', '中国');
        }
      );
    } else {
      fetchWeatherByLocation(39.9042, 116.4074, '北京', '中国');
    }
  }, [fetchWeatherByLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">加载天气数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-50">
        <div className="text-center bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl">
          <p className="text-red-500 text-lg mb-4">错误: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <WeatherAnimation weatherType={weather.forecast[0]?.icon || 'sunny'} />
      
      <div className="relative z-10 px-4 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 mb-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-gray-600 mb-1">
              {weather.city}, {weather.country}
            </div>
            <div className="text-gray-500 mb-4">
              {new Date().toLocaleDateString('zh-CN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-4">
              {getWeatherIconComponent(weather.forecast[0]?.icon || 'sunny')}
              <div>
                <div className="text-7xl font-bold text-gray-800">{weather.temperature}°</div>
                <div className="text-xl text-gray-600">{weather.description}</div>
              </div>
            </div>

            <div className="flex justify-center gap-8 text-gray-600">
              <div>
                <span className="text-sm">最高</span>
                <div className="font-semibold">{weather.forecast[0]?.maxTemp}°</div>
              </div>
              <div>
                <span className="text-sm">最低</span>
                <div className="font-semibold">{weather.forecast[0]?.minTemp}°</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <WeatherForecast forecast={weather.forecast} />
        </div>

        <div>
          <WeatherDetails weather={weather} />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useWeatherStore } from '@/store/weatherStore';
import { GeocodingResult } from '@/types/weather';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { searchCityByName, searchResults, searchLoading, clearSearchResults, fetchWeatherByLocation } = useWeatherStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.trim()) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        searchCityByName(query);
      }, 300);
    } else {
      clearSearchResults();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, searchCityByName, clearSearchResults]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        clearSearchResults();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSearchResults]);

  const handleSelectCity = (city: GeocodingResult) => {
    fetchWeatherByLocation(city.latitude, city.longitude, city.name, city.country);
    setQuery('');
    clearSearchResults();
  };

  const handleUseMyLocation = () => {
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
              fetchWeatherByLocation(latitude, longitude, '当前位置', '');
            }
          } catch {
            fetchWeatherByLocation(latitude, longitude, '当前位置', '');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索城市..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-gray-700 placeholder-gray-400"
        />
        {searchLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden z-50">
          {searchResults.map((city, index) => (
            <button
              key={index}
              onClick={() => handleSelectCity(city)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100/50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium text-gray-700">{city.name}</div>
                <div className="text-sm text-gray-500">{city.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleUseMyLocation}
        className="mt-3 w-full py-3 px-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all flex items-center justify-center gap-2 text-gray-600 font-medium shadow-md"
      >
        <MapPin className="w-4 h-4" />
        使用我的位置
      </button>
    </div>
  );
}

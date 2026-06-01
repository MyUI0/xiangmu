import { create } from 'zustand';
import { WeatherData, GeocodingResult } from '@/types/weather';
import { fetchWeather, searchCity } from '@/services/weatherApi';

interface WeatherStore {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  searchResults: GeocodingResult[];
  searchLoading: boolean;
  setWeather: (weather: WeatherData) => void;
  fetchWeatherByLocation: (lat: number, lon: number, city: string, country: string) => Promise<void>;
  searchCityByName: (query: string) => Promise<void>;
  clearSearchResults: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  weather: null,
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,

  setWeather: (weather) => set({ weather }),

  fetchWeatherByLocation: async (lat, lon, city, country) => {
    set({ loading: true, error: null });
    try {
      const weather = await fetchWeather(lat, lon, city, country);
      set({ weather, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  searchCityByName: async (query) => {
    set({ searchLoading: true, error: null });
    try {
      const results = await searchCity(query);
      set({ searchResults: results, searchLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, searchLoading: false });
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),
}));

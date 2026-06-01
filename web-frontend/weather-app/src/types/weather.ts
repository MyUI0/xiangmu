export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  uvIndex: number;
  visibility: number;
  forecast: ForecastDay[];
  weatherCode: number;
}

export interface ForecastDay {
  date: string;
  day: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
  weatherCode: number;
}

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
}

import { WeatherData, ForecastDay, GeocodingResult } from '@/types/weather';

const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: '晴朗',
  1: '大部晴朗',
  2: '局部多云',
  3: '多云',
  45: '雾',
  48: '雾凇',
  51: '小毛毛雨',
  53: '毛毛雨',
  55: '大毛毛雨',
  56: '冻毛毛雨',
  57: '大冻毛毛雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '冻雨',
  67: '大冻雨',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '雪粒',
  80: '小阵雨',
  81: '阵雨',
  82: '强阵雨',
  85: '小阵雪',
  86: '大阵雪',
  95: '雷暴',
  96: '雷暴伴小冰雹',
  99: '雷暴伴大冰雹',
};

export function getWeatherDescription(code: number): { description: string; icon: string } {
  const description = WEATHER_CODE_DESCRIPTIONS[code] || '未知天气';
  let icon = 'sunny';
  
  if (code === 0 || code === 1) icon = 'sunny';
  else if (code === 2 || code === 3) icon = 'cloudy';
  else if (code >= 45 && code <= 48) icon = 'foggy';
  else if (code >= 51 && code <= 57) icon = 'drizzle';
  else if (code >= 61 && code <= 67) icon = 'rainy';
  else if (code >= 71 && code <= 77) icon = 'snowy';
  else if (code >= 80 && code <= 82) icon = 'rainy';
  else if (code >= 85 && code <= 86) icon = 'snowy';
  else if (code >= 95) icon = 'thunderstorm';
  
  return { description, icon };
}

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=zh&format=json`
  );
  
  if (!response.ok) throw new Error('搜索城市失败');
  
  const data = await response.json();
  
  if (!data.results) return [];
  
  return data.results.map((result: any) => ({
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    countryCode: result.country_code,
  }));
}

export async function fetchWeather(lat: number, lon: number, cityName: string, countryName: string): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=7`
  );
  
  if (!response.ok) throw new Error('获取天气数据失败');
  
  const data = await response.json();
  
  const current = data.current;
  const daily = data.daily;
  
  const { description, icon } = getWeatherDescription(current.weather_code);
  
  const forecast: ForecastDay[] = [];
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(daily.time[i]);
    const dayName = days[date.getDay()];
    const forecastWeather = getWeatherDescription(daily.weather_code[i]);
    
    forecast.push({
      date: daily.time[i],
      day: i === 0 ? '今天' : dayName,
      minTemp: Math.round(daily.temperature_2m_min[i]),
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      icon: forecastWeather.icon,
      description: forecastWeather.description,
      weatherCode: daily.weather_code[i],
    });
  }
  
  return {
    city: cityName,
    country: countryName,
    temperature: Math.round(current.temperature_2m),
    description,
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    pressure: Math.round(current.surface_pressure),
    feelsLike: Math.round(current.apparent_temperature),
    uvIndex: Math.round(daily.uv_index_max[0]),
    visibility: Math.round(current.visibility / 1000),
    forecast,
    weatherCode: current.weather_code,
  };
}

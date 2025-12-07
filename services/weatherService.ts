
// Open-Meteo API Service (Free, No Key Required)

export interface WeatherData {
  current: {
    temp: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    isDay: number;
    time: string;
    uvIndex: number;
    visibility: number; // meters
    dewPoint: number;
  };
  daily: {
    time: string[];
    maxTemp: number[];
    minTemp: number[];
    weatherCode: number[];
    sunrise: string[];
    sunset: string[];
    precipitation: number[];
    precipitationProbability: number[];
    maxWind: number[];
    uvIndex: number[];
  };
  hourly: {
    time: string[];
    temp: number[];
    weatherCode: number[];
    precipitationProbability: number[];
    isDay: number[];
  };
  details: {
    humidity: number;
    pressure: number;
    feelsLike: number;
    aqi?: number; // European AQI
  }
}

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Region
}

// WMO Weather Code Mapper to Lucide Icons and Labels
export const getWeatherInfo = (code: number, isDay: number = 1) => {
    // Codes: https://open-meteo.com/en/docs
    
    // Clear
    if (code === 0) return { label: 'Clear Sky', icon: isDay ? 'Sun' : 'Moon', color: isDay ? 'text-amber-400' : 'text-slate-200' };
    
    // Cloudy
    if (code === 1) return { label: 'Mainly Clear', icon: isDay ? 'CloudSun' : 'CloudMoon', color: 'text-slate-300' };
    if (code === 2) return { label: 'Partly Cloudy', icon: isDay ? 'CloudSun' : 'CloudMoon', color: 'text-slate-300' };
    if (code === 3) return { label: 'Overcast', icon: 'Cloud', color: 'text-slate-400' };
    
    // Fog
    if (code === 45 || code === 48) return { label: 'Foggy', icon: 'CloudFog', color: 'text-slate-400' };
    
    // Drizzle
    if ([51, 53, 55].includes(code)) return { label: 'Drizzle', icon: 'CloudDrizzle', color: 'text-blue-300' };
    if ([56, 57].includes(code)) return { label: 'Freezing Drizzle', icon: 'CloudHail', color: 'text-cyan-300' };
    
    // Rain
    if ([61, 63, 65].includes(code)) return { label: 'Rain', icon: 'CloudRain', color: 'text-blue-400' };
    if ([66, 67].includes(code)) return { label: 'Freezing Rain', icon: 'CloudHail', color: 'text-cyan-300' };
    
    // Rain Showers
    if ([80, 81, 82].includes(code)) return { label: 'Rain Showers', icon: 'CloudRain', color: 'text-blue-400' };

    // Snow
    if ([71, 73, 75, 77].includes(code)) return { label: 'Snow', icon: 'Snowflake', color: 'text-white' };
    if ([85, 86].includes(code)) return { label: 'Snow Showers', icon: 'Snowflake', color: 'text-white' };
    
    // Thunder
    if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: 'CloudLightning', color: 'text-yellow-400' };

    // Explicit fallback for unhandled codes to avoid 'Unknown' if mapped incorrectly in UI
    return { label: 'Cloudy', icon: 'Cloud', color: 'text-slate-400' };
};

export const searchCity = async (query: string): Promise<GeoLocation[]> => {
    if (query.length < 2) return [];
    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await res.json();
        return data.results || [];
    } catch (e) {
        console.error("Geo search failed", e);
        return [];
    }
};

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
        // Fetch Weather Data (Forecast)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,dew_point_2m&hourly=temperature_2m,weather_code,is_day,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=14`;
        
        // Fetch Air Quality Data (Separate API)
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`;

        const [weatherRes, aqiRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(aqiUrl).catch(() => null) // Allow AQI to fail gracefully
        ]);

        const data = await weatherRes.json();
        const aqiData = aqiRes ? await aqiRes.json() : null;
        
        // Calculate current UV Index from today's max (approximate for current view if real-time not available in free tier current endpoint)
        // Actually, Open-Meteo doesn't have real-time UV in 'current', so we use today's max or 0 at night
        const currentHour = new Date().getHours();
        const isNight = currentHour < 6 || currentHour > 20;
        const estimatedUV = isNight ? 0 : (data.daily.uv_index_max[0] || 0);

        return {
            current: {
                temp: data.current.temperature_2m,
                weatherCode: data.current.weather_code,
                windSpeed: data.current.wind_speed_10m,
                windDirection: data.current.wind_direction_10m,
                isDay: data.current.is_day,
                time: data.current.time,
                uvIndex: estimatedUV,
                visibility: data.current.visibility, // meters
                dewPoint: data.current.dew_point_2m
            },
            details: {
                humidity: data.current.relative_humidity_2m,
                pressure: data.current.surface_pressure,
                feelsLike: data.current.apparent_temperature,
                aqi: aqiData?.current?.european_aqi || 0
            },
            daily: {
                time: data.daily.time,
                maxTemp: data.daily.temperature_2m_max,
                minTemp: data.daily.temperature_2m_min,
                weatherCode: data.daily.weather_code,
                sunrise: data.daily.sunrise,
                sunset: data.daily.sunset,
                precipitation: data.daily.precipitation_sum,
                precipitationProbability: data.daily.precipitation_probability_max,
                maxWind: data.daily.wind_speed_10m_max,
                uvIndex: data.daily.uv_index_max
            },
            hourly: {
                time: data.hourly.time.slice(0, 24), // First 24 hours
                temp: data.hourly.temperature_2m.slice(0, 24),
                weatherCode: data.hourly.weather_code.slice(0, 24),
                precipitationProbability: data.hourly.precipitation_probability.slice(0, 24),
                isDay: data.hourly.is_day.slice(0, 24)
            }
        };
    } catch (e) {
        console.error("Weather fetch failed", e);
        throw e;
    }
};

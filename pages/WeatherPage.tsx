
import React, { useState, useEffect, useRef } from 'react';
import { PageRoute } from '../types';
import { Home, Search, MapPin, Wind, Droplets, Gauge, Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, CloudSun, CloudMoon, Snowflake, CloudHail, Navigation, Calendar, Sunrise, Sunset, Umbrella, Eye, Thermometer, Leaf, Compass } from 'lucide-react';
import { searchCity, fetchWeather, getWeatherInfo, GeoLocation, WeatherData } from '../services/weatherService';

interface WeatherPageProps {
  onNavigate: (page: PageRoute) => void;
}

// Icon component mapper
const WeatherIcon = ({ name, className, size = 24 }: { name: string, className?: string, size?: number }) => {
    const icons: any = { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, CloudSun, CloudMoon, Snowflake, CloudHail };
    const IconComponent = icons[name] || Cloud;
    return <IconComponent size={size} className={className} />;
};

export const WeatherPage: React.FC<WeatherPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0); // Default expand today
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initial Load (Current Location)
  useEffect(() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            loadWeather(latitude, longitude, "My Location");
        }, () => {
            // Default to London if denied
            loadWeather(51.5074, -0.1278, "London", "United Kingdom");
        });
    } else {
        loadWeather(51.5074, -0.1278, "London", "United Kingdom");
    }
  }, []);

  const loadWeather = async (lat: number, lon: number, name: string, country?: string) => {
    setLoading(true);
    setResults([]); // Close dropdown
    setQuery(''); // Clear search bar for clean look
    try {
        const data = await fetchWeather(lat, lon);
        setWeather(data);
        setLocation({ id: 0, name, latitude: lat, longitude: lon, country: country || '' });
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length > 2) {
        const res = await searchCity(val);
        setResults(res);
    } else {
        setResults([]);
    }
  };

  const getBackgroundClass = () => {
    if (!weather) return 'bg-gradient-to-br from-slate-900 to-slate-800';
    const code = weather.current.weatherCode;
    const isDay = weather.current.isDay;

    // Night
    if (!isDay) return 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]';

    // Clear Day
    if (code === 0) return 'bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600';

    // Cloudy
    if (code >= 1 && code <= 3) return 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600';

    // Rain / Thunder
    if (code >= 51) return 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900';

    return 'bg-gradient-to-br from-slate-900 to-slate-800';
  };

  const getAqiStatus = (aqi: number) => {
      if (aqi < 20) return { label: 'Good', color: 'text-emerald-400', bar: 'bg-emerald-500' };
      if (aqi < 40) return { label: 'Fair', color: 'text-yellow-400', bar: 'bg-yellow-500' };
      if (aqi < 60) return { label: 'Moderate', color: 'text-orange-400', bar: 'bg-orange-500' };
      if (aqi < 80) return { label: 'Poor', color: 'text-red-400', bar: 'bg-red-500' };
      return { label: 'Very Poor', color: 'text-purple-400', bar: 'bg-purple-500' };
  };

  const getWindDir = (deg: number) => {
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} text-white font-sans transition-colors duration-1000 selection:bg-white/30`}>
      
      {/* Nav */}
      <nav className="border-b border-white/10 bg-black/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-white/70 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <CloudSun className="text-sky-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Weather</span>
          </button>
          
          <div className="relative w-full max-w-xs ml-4 z-[60]">
               <div className="relative">
                   <input 
                      ref={searchInputRef}
                      type="text" 
                      value={query}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search city..."
                      className="w-full bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-all shadow-sm"
                   />
                   <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
               </div>
               
               {/* Search Results Dropdown */}
               {results.length > 0 && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
                       {results.map((res) => (
                           <button 
                                key={res.id}
                                onClick={() => loadWeather(res.latitude, res.longitude, res.name, res.country)}
                                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                           >
                               <div>
                                   <div className="font-bold text-white text-sm">{res.name}</div>
                                   <div className="text-xs text-slate-400">{res.admin1 ? `${res.admin1}, ` : ''}{res.country}</div>
                               </div>
                               <Navigation size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                           </button>
                       ))}
                   </div>
               )}
                {query.length > 2 && results.length === 0 && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center text-xs text-slate-400 shadow-xl">
                        No locations found
                     </div>
                )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {loading || !weather ? (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
                <Sun size={64} className="text-white/50 mb-4 animate-spin-slow" />
                <p className="text-white/50 font-medium">Fetching Forecast...</p>
            </div>
        ) : (
            <div className="animate-fade-in pb-20">
                
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-12 relative">
                    <div 
                        onClick={() => searchInputRef.current?.focus()}
                        className="flex items-center gap-2 text-white/90 font-bold mb-2 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/5 shadow-sm cursor-pointer hover:bg-black/30 transition-colors group"
                    >
                        <MapPin size={16} className="text-white" />
                        {location?.name}{location?.country ? `, ${location?.country}` : ''}
                        <Search size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="relative group cursor-default">
                        <h1 className="text-[7rem] md:text-[10rem] font-black leading-none tracking-tighter drop-shadow-2xl">
                            {Math.round(weather.current.temp)}°
                        </h1>
                        <div className="absolute -right-4 top-8 md:-right-8 md:top-12 animate-pulse-slow">
                             <WeatherIcon 
                                name={getWeatherInfo(weather.current.weatherCode, weather.current.isDay).icon} 
                                size={64}
                                className="drop-shadow-lg"
                             />
                        </div>
                    </div>
                    
                    <div className="text-2xl md:text-3xl font-medium text-white/90 mb-2 capitalize drop-shadow-md">
                        {getWeatherInfo(weather.current.weatherCode, weather.current.isDay).label}
                    </div>
                    
                    <div className="flex gap-4 text-white/70 font-medium text-lg mb-8">
                         <span>H: {Math.round(weather.daily.maxTemp[0])}°</span>
                         <span>L: {Math.round(weather.daily.minTemp[0])}°</span>
                    </div>

                    {/* Air Quality Chip */}
                    {weather.details.aqi !== undefined && (
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 mb-8">
                             <Leaf size={16} className="text-emerald-400" />
                             <span className="text-sm font-bold">AQI {weather.details.aqi}</span>
                             <span className="text-xs opacity-70">• {getAqiStatus(weather.details.aqi).label}</span>
                        </div>
                    )}
                </div>

                {/* 24-Hour Forecast Scroll */}
                <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-6 border border-white/5 shadow-2xl mb-6">
                    <div className="flex items-center gap-2 mb-4 text-sm font-bold text-white/70 uppercase tracking-wider border-b border-white/5 pb-2">
                        <div className="w-2 h-2 rounded-full bg-white/50"></div> Hourly Forecast
                    </div>
                    <div className="flex overflow-x-auto gap-6 pb-4 snap-x">
                        {weather.hourly.time.map((t, i) => {
                            const date = new Date(t);
                            const hour = date.getHours();
                            const isNow = i === 0;
                            const info = getWeatherInfo(weather.hourly.weatherCode[i], weather.hourly.isDay[i]);
                            
                            return (
                                <div key={t} className="flex-shrink-0 flex flex-col items-center gap-3 snap-start min-w-[3rem]">
                                    <span className="text-sm font-medium text-white/70">
                                        {isNow ? 'Now' : `${hour}:00`}
                                    </span>
                                    <WeatherIcon name={info.icon} size={24} className="text-white drop-shadow-sm" />
                                    <span className="text-lg font-bold">{Math.round(weather.hourly.temp[i])}°</span>
                                    
                                    {/* Precip Chance if > 0 */}
                                    {weather.hourly.precipitationProbability[i] > 0 && (
                                        <div className="text-[10px] font-bold text-cyan-300 flex flex-col items-center -mt-1">
                                            <span>{weather.hourly.precipitationProbability[i]}%</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current Details Bento Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    
                    {/* UV Index */}
                    <div className="bg-black/20 backdrop-blur-lg p-5 rounded-2xl border border-white/5 flex flex-col justify-between aspect-square">
                        <div className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase">
                            <Sun size={16} /> UV Index
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{Math.round(weather.current.uvIndex)}</div>
                            <div className="text-sm text-white/70">
                                {weather.current.uvIndex > 5 ? 'High' : weather.current.uvIndex > 2 ? 'Moderate' : 'Low'}
                            </div>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div 
                                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" 
                                style={{ width: `${Math.min((weather.current.uvIndex / 11) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Sunset */}
                    <div className="bg-black/20 backdrop-blur-lg p-5 rounded-2xl border border-white/5 flex flex-col justify-between aspect-square">
                        <div className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase">
                            <Sunset size={16} /> Sunset
                        </div>
                        <div>
                             <div className="text-3xl font-bold">
                                {new Date(weather.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                             <div className="text-xs text-white/50 mt-1">
                                Sunrise: {new Date(weather.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                        </div>
                        <div className="text-xs text-white/50">Loss of daylight</div>
                    </div>

                    {/* Wind */}
                    <div className="bg-black/20 backdrop-blur-lg p-5 rounded-2xl border border-white/5 flex flex-col justify-between aspect-square">
                        <div className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase">
                            <Wind size={16} /> Wind
                        </div>
                        <div className="relative flex items-center justify-center flex-1">
                             {/* Compass Visual */}
                             <div className="absolute inset-0 border-2 border-white/5 rounded-full m-2"></div>
                             <div 
                                className="absolute bg-white/20 w-1 h-full rounded-full transform transition-transform duration-1000"
                                style={{ transform: `rotate(${weather.current.windDirection}deg)` }}
                             >
                                 <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
                             </div>
                             <div className="text-center z-10 bg-transparent">
                                 <div className="text-2xl font-bold">{weather.current.windSpeed}</div>
                                 <div className="text-xs text-white/50">km/h</div>
                             </div>
                        </div>
                        <div className="text-center text-xs font-bold text-white/70">
                            {getWindDir(weather.current.windDirection)}
                        </div>
                    </div>

                    {/* Feels Like / Humidity */}
                    <div className="bg-black/20 backdrop-blur-lg p-5 rounded-2xl border border-white/5 flex flex-col justify-between aspect-square">
                        <div className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase">
                            <Thermometer size={16} /> Feels Like
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{Math.round(weather.details.feelsLike)}°</div>
                            <div className="text-sm text-white/70">
                                Humidity: {weather.details.humidity}%
                            </div>
                        </div>
                        <div className="text-xs text-white/50">
                            Dew Point: {Math.round(weather.current.dewPoint)}°
                        </div>
                    </div>
                </div>

                {/* 14-Day Forecast List */}
                <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-white/60" /> 14-Day Forecast
                    </h2>
                    
                    <div className="space-y-1">
                        {weather.daily.time.map((date, i) => {
                            const dateObj = new Date(date);
                            const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const info = getWeatherInfo(weather.daily.weatherCode[i]);
                            const isExpanded = expandedDay === i;
                            
                            // Visual bar calculation
                            const minAll = Math.min(...weather.daily.minTemp);
                            const maxAll = Math.max(...weather.daily.maxTemp);
                            const range = maxAll - minAll;
                            const left = ((weather.daily.minTemp[i] - minAll) / range) * 100;
                            const width = ((weather.daily.maxTemp[i] - weather.daily.minTemp[i]) / range) * 100;

                            return (
                                <div key={date} className="overflow-hidden rounded-xl transition-all duration-300">
                                    <div 
                                        onClick={() => setExpandedDay(isExpanded ? null : i)}
                                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors group
                                            ${isExpanded ? 'bg-white/10' : 'hover:bg-white/5'}
                                        `}
                                    >
                                        <div className="w-32 flex flex-col justify-center">
                                            <span className="font-medium">{dayName}</span>
                                            <span className="text-xs text-white/50">{dateStr}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-2 w-10">
                                            {weather.daily.precipitationProbability[i] > 20 && (
                                                <div className="flex items-center text-cyan-300 text-xs font-bold">
                                                    <Droplets size={10} className="mr-0.5" /> {weather.daily.precipitationProbability[i]}%
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-center w-10">
                                            <WeatherIcon name={info.icon} size={20} />
                                        </div>
                                        
                                        {/* Min/Max Bar */}
                                        <div className="flex-1 flex items-center gap-3 px-4">
                                            <span className="text-xs text-white/50 w-6 text-right">{Math.round(weather.daily.minTemp[i])}°</span>
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                                                <div 
                                                    className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 opacity-80"
                                                    style={{ left: `${left}%`, width: `${width}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-white w-6">{Math.round(weather.daily.maxTemp[i])}°</span>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="bg-black/20 p-4 mx-2 mb-2 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in border border-white/5">
                                            <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                                                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                                                    <Umbrella size={12}/> Rain Vol
                                                </div>
                                                <div className="font-bold">{weather.daily.precipitation[i]} <span className="text-[10px] font-normal opacity-50">mm</span></div>
                                            </div>
                                            <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                                                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                                                    <Wind size={12}/> Max Wind
                                                </div>
                                                <div className="font-bold">{weather.daily.maxWind[i]} <span className="text-[10px] font-normal opacity-50">km/h</span></div>
                                            </div>
                                            <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                                                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                                                    <Sun size={12}/> UV Max
                                                </div>
                                                <div className="font-bold">{weather.daily.uvIndex[i]?.toFixed(1) || '-'}</div>
                                            </div>
                                            <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                                                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                                                    <Sunrise size={12}/> Sunrise
                                                </div>
                                                <div className="font-bold">
                                                    {new Date(weather.daily.sunrise[i]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        )}
      </main>
    </div>
  );
};

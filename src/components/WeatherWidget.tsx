import React, { useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Compass,
  Calendar
} from 'lucide-react';
import { WeatherData, SupportedLanguage } from '../types/index.ts';
import { getTranslation } from '../utils/i18n.ts';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  language: SupportedLanguage;
  onRefreshLocation: (lat: number, lon: number, cityName: string) => Promise<void>;
  isLoading: boolean;
}

const REGIONAL_STATIONS = [
  { name: 'Hyderabad (Telangana, India)', lat: 17.3850, lon: 78.4867 },
  { name: 'Guntur (Andhra Pradesh, India)', lat: 16.3067, lon: 80.4365 },
  { name: 'Ludhiana (Punjab, India)', lat: 30.9010, lon: 75.8573 },
  { name: 'Fresno (California, USA)', lat: 36.7468, lon: -119.7726 },
  { name: 'Salinas Valley (California, USA)', lat: 36.6777, lon: -121.6555 },
  { name: 'Des Moines (Iowa, USA)', lat: 41.5868, lon: -93.6250 },
  { name: 'Almería (Andalucía, Spain)', lat: 36.8381, lon: -2.4597 }
];

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  language,
  onRefreshLocation,
  isLoading
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [selectedPreset, setSelectedPreset] = useState<string>(REGIONAL_STATIONS[0].name);

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = REGIONAL_STATIONS.find(s => s.name === e.target.value);
    if (found) {
      setSelectedPreset(found.name);
      onRefreshLocation(found.lat, found.lon, found.name);
    }
  };

  const handleUseBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onRefreshLocation(latitude, longitude, 'My Farm Field');
        setSelectedPreset('My Farm Field');
      },
      (err) => {
        alert('Could not retrieve current location: ' + err.message);
      }
    );
  };

  if (!weather) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-stone-700">Connecting to Open-Meteo Weather Service...</p>
      </div>
    );
  }

  const fungalRisk = weather.disease_risk_index.fungal_risk;
  const bacterialRisk = weather.disease_risk_index.bacterial_risk;

  const getRiskBadge = (risk: 'Low' | 'Moderate' | 'High') => {
    if (risk === 'High') return 'bg-rose-100 text-rose-800 border-rose-300';
    if (risk === 'Moderate') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Main Weather & Risk Board */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        
        {/* Top Controls: Location & Station Picker */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                {weather.city}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Powered by Open-Meteo High-Resolution Meteorological Forecast
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedPreset}
              onChange={handleStationChange}
              className="text-xs font-semibold text-stone-800 border border-stone-300 rounded-xl px-3 py-2 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {REGIONAL_STATIONS.map((st) => (
                <option key={st.name} value={st.name}>
                  {st.name}
                </option>
              ))}
              {selectedPreset === 'My Farm Field' && (
                <option value="My Farm Field">My Farm Field (GPS)</option>
              )}
            </select>

            <button
              onClick={handleUseBrowserLocation}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200 transition cursor-pointer"
              title="Use current GPS location"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Current GPS</span>
            </button>
          </div>
        </div>

        {/* Current Measurements Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Temperature
              </span>
              <span className="text-xl sm:text-2xl font-black text-stone-900">
                {weather.temperature}°C
              </span>
              <span className="block text-[10px] text-stone-500 truncate">
                {weather.condition_text}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Relative Humidity
              </span>
              <span className="text-xl sm:text-2xl font-black text-stone-900">
                {weather.relative_humidity}%
              </span>
              <span className="block text-[10px] text-stone-500">
                {weather.relative_humidity > 80 ? 'High dew risk' : 'Normal canopy moisture'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Wind Speed
              </span>
              <span className="text-xl sm:text-2xl font-black text-stone-900">
                {weather.wind_speed} <span className="text-xs font-normal">km/h</span>
              </span>
              <span className="block text-[10px] text-stone-500">
                {weather.wind_speed > 18 ? 'Drift hazard' : 'Safe wind for spraying'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Precipitation
              </span>
              <span className="text-xl sm:text-2xl font-black text-stone-900">
                {weather.precipitation} <span className="text-xs font-normal">mm</span>
              </span>
              <span className="block text-[10px] text-stone-500">
                {weather.precipitation > 0 ? 'Rainfall active' : 'No rain measured'}
              </span>
            </div>
          </div>

        </div>

        {/* Disease Risk Indices & Spray Window */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          
          {/* Fungal Risk */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Fungal Spore Risk
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getRiskBadge(fungalRisk)}`}>
                {fungalRisk} Risk
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {fungalRisk === 'High'
                ? 'High humidity combined with moderate temperature triggers rapid germination of Blight, Mildew, and Rust spores.'
                : fungalRisk === 'Moderate'
                ? 'Moderate moisture. Leaves remain damp during early mornings.'
                : 'Dry ambient conditions. Low risk of fungal proliferation.'}
            </p>
          </div>

          {/* Bacterial Splash Risk */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Bacterial Spread Risk
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getRiskBadge(bacterialRisk)}`}>
                {bacterialRisk} Risk
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {bacterialRisk === 'High'
                ? 'Rain splash readily spreads Xanthomonas and Pseudomonas bacterial ooze into wounds and stomata.'
                : 'Dry canopies minimize splash-borne bacterial translocation.'}
            </p>
          </div>

          {/* Spray Window Suitability */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Spray Window Status
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                Active Assessment
              </span>
            </div>
            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
              {weather.disease_risk_index.spray_recommendation}
            </p>
          </div>

        </div>

        {/* 5-Day Microclimate Forecast */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>5-Day Agricultural Weather Outlook</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {weather.daily_forecast.map((day, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center flex flex-col justify-between"
              >
                <div>
                  <span className="block text-xs font-bold text-stone-800">
                    {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : day.date}
                  </span>
                  <div className="my-2 flex justify-center">
                    <CloudSun className="w-6 h-6 text-amber-500" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {Math.round(day.temp_max)}° <span className="text-stone-400 font-normal">/ {Math.round(day.temp_min)}°C</span>
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>{day.precip_prob}% rain</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

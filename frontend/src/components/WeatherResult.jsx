import { useState } from "react";
import api from "../api/axios";

const normalize = (result) => {
  const { weather } = result;
  if (weather.source === "current") {
    const d = weather.data;
    return { label: "Right now", temp: d.main?.temp, feelsLike: d.main?.feels_like, description: d.weather?.[0]?.description, icon: d.weather?.[0]?.icon, humidity: d.main?.humidity, wind: d.wind?.speed, timestamp: d.dt };
  }
  if (weather.source === "forecast") {
    const d = weather.data;
    return { label: "Forecast", temp: d.main?.temp, feelsLike: d.main?.feels_like, description: d.weather?.[0]?.description, icon: d.weather?.[0]?.icon, humidity: d.main?.humidity, wind: d.wind?.speed, timestamp: d.dt };
  }
  if (weather.source === "historical") {
    const entry = weather.data;
    return { label: "Historical", temp: entry?.temp, feelsLike: entry?.feels_like, description: entry?.weather?.[0]?.description, icon: entry?.weather?.[0]?.icon, humidity: entry?.humidity, wind: entry?.wind_speed, timestamp: entry?.dt };
  }
  return { label: "Unknown" };
};

const WeatherResult = ({ result }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  if (!result) return null;
  const normalized = normalize(result);
  const { location } = result;

  const handleSaveFavorite = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await api.post("/favorites", { name: location.name, lat: location.lat, lon: location.lon });
      setSaved(true);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Couldn't save this location.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="weather-result">
      <div className="weather-result__header">
        <div>
          <span className="weather-result__label">{normalized.label}</span>
          <h3>{location.name}</h3>
        </div>
        {normalized.icon && (
          <img className="weather-result__icon" src={`https://openweathermap.org/img/wn/${normalized.icon}@2x.png`} alt={normalized.description || "Weather icon"} />
        )}
      </div>
      {normalized.timestamp && (
        <span className="weather-result__time">{new Date(normalized.timestamp * 1000).toLocaleString()}</span>
      )}
      <div className="weather-result__body">
        <div className="weather-result__temp">{normalized.temp !== undefined ? `${Math.round(normalized.temp)}°C` : "—"}</div>
        <div className="weather-result__meta">
          <p className="weather-result__description">{normalized.description || "No description"}</p>
          {normalized.feelsLike !== undefined && <p>Feels like {Math.round(normalized.feelsLike)}°C</p>}
          {normalized.humidity !== undefined && <p>Humidity {normalized.humidity}%</p>}
          {normalized.wind !== undefined && <p>Wind {normalized.wind} m/s</p>}
        </div>
      </div>
      <div className="weather-result__footer">
        <button className="weather-result__save" onClick={handleSaveFavorite} disabled={saving || saved}>
          {saved ? "Saved ★" : saving ? "Saving..." : "Save this city"}
        </button>
        {saveError && <span className="weather-result__save-error">{saveError}</span>}
      </div>
    </div>
  );
};

export default WeatherResult;
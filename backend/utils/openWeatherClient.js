const axios = require("axios");

const GEO_BASE = "https://api.openweathermap.org/geo/1.0";
const DATA_BASE = "https://api.openweathermap.org/data/2.5";
const ONECALL_BASE = "https://api.openweathermap.org/data/4.0/onecall";

const getKey = () => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === "your_openweather_api_key_here") {
    const err = new Error(
      "OPENWEATHER_API_KEY is not set. Add your key to backend/.env to enable weather lookups."
    );
    err.statusCode = 500;
    throw err;
  }
  return key;
};

const geocodeLocation = async (query) => {
  const { data } = await axios.get(`${GEO_BASE}/direct`, {
    params: { q: query, limit: 5, appid: getKey() },
  });

  return data.map((place) => ({
    name: place.name,
    state: place.state,
    country: place.country,
    lat: place.lat,
    lon: place.lon,
  }));
};

// Turns a coordinate pair back into a place name (used by the map picker)
const reverseGeocodeLocation = async (lat, lon) => {
  const { data } = await axios.get(`${GEO_BASE}/reverse`, {
    params: { lat, lon, limit: 1, appid: getKey() },
  });
  return data[0] || null;
};

const getCurrentWeather = async (lat, lon) => {
  const { data } = await axios.get(`${DATA_BASE}/weather`, {
    params: { lat, lon, units: "metric", appid: getKey() },
  });
  return data;
};

const getForecast = async (lat, lon) => {
  const { data } = await axios.get(`${DATA_BASE}/forecast`, {
    params: { lat, lon, units: "metric", appid: getKey() },
  });
  return data;
};

const getHourlyTimeline = async (lat, lon, startUnixSeconds) => {
  const { data } = await axios.get(`${ONECALL_BASE}/timeline/1h`, {
    params: { lat, lon, start: startUnixSeconds, units: "metric", appid: getKey() },
  });
  return data; // { lat, lon, timezone, data: [...], next?, prev? }
};

const findClosestForecastEntry = (forecastList, targetUnixSeconds) => {
  return forecastList.reduce((closest, entry) => {
    const diff = Math.abs(entry.dt - targetUnixSeconds);
    const closestDiff = Math.abs(closest.dt - targetUnixSeconds);
    return diff < closestDiff ? entry : closest;
  }, forecastList[0]);
};

module.exports = {
  geocodeLocation,
  reverseGeocodeLocation,
  getCurrentWeather,
  getForecast,
  getHourlyTimeline,
  findClosestForecastEntry,
};
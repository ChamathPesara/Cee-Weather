const User = require("../models/User");
const {
  geocodeLocation,
  reverseGeocodeLocation,
  getCurrentWeather,
  getForecast,
  getHourlyTimeline,
  findClosestForecastEntry,
} = require("../utils/openWeatherClient");

const FIVE_DAYS_SECONDS = 5 * 24 * 60 * 60;

const fetchWeatherForTime = async (lat, lon, timeParam) => {
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!timeParam) {
    const current = await getCurrentWeather(lat, lon);
    return { source: "current", data: current };
  }

  const targetSeconds = Math.floor(new Date(timeParam).getTime() / 1000);

  if (Number.isNaN(targetSeconds)) {
    const err = new Error("Invalid time value. Use an ISO date string or unix timestamp.");
    err.statusCode = 400;
    throw err;
  }

  const diff = targetSeconds - nowSeconds;

  if (diff < 0) {
    const timeline = await getHourlyTimeline(lat, lon, targetSeconds);
    const closest = findClosestForecastEntry(timeline.data, targetSeconds);
    return { source: "historical", data: closest, requestedTime: targetSeconds };
  }

  if (diff <= FIVE_DAYS_SECONDS) {
    const forecast = await getForecast(lat, lon);
    const closest = findClosestForecastEntry(forecast.list, targetSeconds);
    return {
      source: "forecast",
      data: closest,
      city: forecast.city,
      requestedTime: targetSeconds,
    };
  }

  const err = new Error(
    "That date is more than 5 days out. The free forecast tier only covers the next 5 days."
  );
  err.statusCode = 400;
  throw err;
};

const logSearch = async (userId, entry) => {
  const MAX_HISTORY = 100;
  const user = await User.findById(userId);
  if (!user) return;
  user.searchHistory.unshift(entry);
  if (user.searchHistory.length > MAX_HISTORY) {
    user.searchHistory = user.searchHistory.slice(0, MAX_HISTORY);
  }
  await user.save();
};

const geocode = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      res.status(400);
      throw new Error("Provide a place name with ?q=");
    }
    const matches = await geocodeLocation(q);
    res.json(matches);
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { q, lat, lon, time } = req.query;

    let location;

    if (lat && lon) {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);
      let name = q;

      if (!name) {
        try {
          const place = await reverseGeocodeLocation(parsedLat, parsedLon);
          name = place
            ? [place.name, place.state, place.country].filter(Boolean).join(", ")
            : `${parsedLat.toFixed(3)}, ${parsedLon.toFixed(3)}`;
        } catch (err) {
          // Reverse geocoding is a nice-to-have - fall back to coordinates
          // rather than failing the whole weather lookup.
          name = `${parsedLat.toFixed(3)}, ${parsedLon.toFixed(3)}`;
        }
      }

      location = { name, lat: parsedLat, lon: parsedLon };
    } else if (q) {
      const matches = await geocodeLocation(q);
      if (!matches.length) {
        res.status(404);
        throw new Error(`No location found matching "${q}"`);
      }
      const best = matches[0];
      location = {
        name: [best.name, best.state, best.country].filter(Boolean).join(", "),
        lat: best.lat,
        lon: best.lon,
      };
    } else {
      res.status(400);
      throw new Error("Provide either ?q=cityName or ?lat=&lon=");
    }

    const weather = await fetchWeatherForTime(location.lat, location.lon, time);

    await logSearch(req.user._id, {
      query: location.name,
      lat: location.lat,
      lon: location.lon,
      searchedAt: new Date(),
    });

    res.json({ location, weather });
  } catch (error) {
    next(error);
  }
};

module.exports = { geocode, search };
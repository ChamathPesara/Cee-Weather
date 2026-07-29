import { useState } from "react";
import api from "../api/axios";

const WeatherSearch = ({ onResult }) => {
  const [query, setQuery] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = { q: query };
      if (time) params.time = new Date(time).toISOString();

      const { data } = await api.get("/weather/search", { params });
      onResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't fetch weather for that search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="weather-search" onSubmit={handleSubmit}>
      <div className="weather-search__field">
        <label htmlFor="search-query">Place</label>
        <input
          id="search-query"
          type="text"
          placeholder="e.g. Colombo, Kandy, Paris..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="weather-search__field">
        <label htmlFor="search-time">Date &amp; time (optional)</label>
        <input
          id="search-time"
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <button className="weather-search__submit" type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <div className="form-error weather-search__error">{error}</div>}

      <p className="weather-search__hint">
        Leave the time blank for current conditions. Pick a time within the next 5 days for a
        forecast, or a past date for history.
      </p>
    </form>
  );
};

export default WeatherSearch;

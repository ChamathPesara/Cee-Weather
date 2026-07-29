import { useState } from "react";
import Navbar from "../components/Navbar";
import WeatherSearch from "../components/WeatherSearch";
import WeatherResult from "../components/WeatherResult";
import "./Search.css";

const Search = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="search-page">
      <Navbar />
      <main className="search-page__body">
        <h1>Search a place</h1>
        <p className="search-page__hint">
          Enter a city to see its current conditions, an upcoming forecast, or weather from a past date.
        </p>
        <WeatherSearch onResult={setResult} />
        {result ? (
          <WeatherResult result={result} />
        ) : (
          <div className="search-page__empty">
            <span className="search-page__empty-icon" aria-hidden="true">🌤️</span>
            <p>Your search result will show up here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
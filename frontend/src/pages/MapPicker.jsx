import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/Navbar";
import WeatherResult from "../components/WeatherResult";
import api from "../api/axios";
import "leaflet/dist/leaflet.css";
import "./MapPicker.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ClickCatcher = ({ onPick }) => {
  useMapEvents({ click(e) { onPick(e.latlng); } });
  return null;
};

const MapPicker = () => {
  const [position, setPosition] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePick = async (latlng) => {
    setPosition(latlng);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.get("/weather/search", {
        params: { lat: latlng.lat, lon: latlng.lng },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't fetch weather for that point.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-page">
      <Navbar />
      <main className="map-page__body">
        <h1>Pick from the map</h1>
        <p className="map-page__hint">Click anywhere to check the current weather there.</p>
        <div className="map-page__map-wrap">
          <MapContainer center={[7.8731, 80.7718]} zoom={7} className="map-page__map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickCatcher onPick={handlePick} />
            {position && <Marker position={position} icon={markerIcon} />}
          </MapContainer>
        </div>
        {loading && <p className="map-page__status">Fetching weather for that point...</p>}
        {error && <div className="form-error map-page__error">{error}</div>}
        {result && <WeatherResult result={result} />}
      </main>
    </div>
  );
};

export default MapPicker;
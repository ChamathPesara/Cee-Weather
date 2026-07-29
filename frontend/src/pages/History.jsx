import { useState } from "react";
import Navbar from "../components/Navbar";
import HistoryList from "../components/HistoryList";
import api from "../api/axios";
import "./History.css";

const History = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [clearing, setClearing] = useState(false);

  const handleClearAll = async () => {
    if (!window.confirm("Clear your entire search history? This can't be undone.")) return;
    setClearing(true);
    try {
      await api.delete("/history");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      // non-fatal
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="history-page">
      <Navbar />
      <main className="history-page__body">
        <div className="history-page__header">
          <div>
            <h1>Your search history</h1>
            <p className="history-page__hint">Every place you've checked, most recent first.</p>
          </div>
          <button className="history-page__clear" onClick={handleClearAll} disabled={clearing}>
            {clearing ? "Clearing..." : "Clear all"}
          </button>
        </div>
        <div className="history-page__list">
          <HistoryList refreshKey={refreshKey} />
        </div>
      </main>
    </div>
  );
};

export default History;
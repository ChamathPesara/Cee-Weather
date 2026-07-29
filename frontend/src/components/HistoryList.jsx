import { useEffect, useState } from "react";
import api from "../api/axios";

const HistoryList = ({ refreshKey }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/history");
      setHistory(data);
    } catch (err) {
      // non-fatal - just leave history empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleDelete = async (index) => {
    try {
      const { data } = await api.delete(`/history/${index}`);
      setHistory(data);
    } catch (err) {
      // ignore - list stays as-is
    }
  };

  if (loading) return <p className="history-loading">Loading history...</p>;
  if (!history.length) return <p className="history-empty">No searches yet.</p>;

  return (
    <ul className="history-list">
      {history.map((entry, index) => (
        <li key={`${entry.searchedAt}-${index}`} className="history-list__item">
          <div>
            <span className="history-list__query">{entry.query}</span>
            <span className="history-list__time">
              {new Date(entry.searchedAt).toLocaleString()}
            </span>
          </div>
          <button
            className="history-list__delete"
            onClick={() => handleDelete(index)}
            aria-label={`Remove ${entry.query} from history`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
};

export default HistoryList;

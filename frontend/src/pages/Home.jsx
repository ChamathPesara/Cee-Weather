import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Home.css";

const options = [
  { key: "search", title: "Search a place", description: "Look up current conditions, a 5-day forecast, or a past date by city name.", path: "/search", icon: "🔍" },
  { key: "map", title: "Pick from the map", description: "Drop a pin anywhere in the world to check the weather there.", path: "/map", icon: "📍" },
  { key: "history", title: "Your search history", description: "Revisit every place you've checked, and remove entries you don't need.", path: "/history", icon: "🕘" },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home">
      <Navbar />
      <main className="home__body">
        <h1>Welcome back, {user?.name}</h1>
        <p className="home__hint">What would you like to do?</p>
        <div className="home__grid">
          {options.map((opt) => (
            <button key={opt.key} className="home__card" onClick={() => navigate(opt.path)}>
              <span className="home__card-icon" aria-hidden="true">{opt.icon}</span>
              <h3>{opt.title}</h3>
              <p>{opt.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
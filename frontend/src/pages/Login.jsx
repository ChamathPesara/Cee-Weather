import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GaugePanel from "../components/GaugePanel";
import "./Auth.css";

const Login = () => {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(form);
    setSubmitting(false);
    if (ok) navigate("/home");
  };

  return (
    <div className="auth-screen">
      <GaugePanel
        eyebrow="Skyline Weather"
        title="Read the sky before you step outside."
        tagline="Search any place, check any time, and keep a running log of the forecasts that matter to you."
      />

      <div className="form-panel">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <h2 className="form-card__heading">Welcome back</h2>
          <p className="form-card__subheading">Log in to see your saved cities and search history.</p>

          {error && <div className="form-error">{error}</div>}

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>

          <p className="form-switch">
            Don't have an account?{" "}
            <Link to="/register" onClick={() => setError(null)}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

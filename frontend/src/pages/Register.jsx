import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GaugePanel from "../components/GaugePanel";
import "./Auth.css";

const Register = () => {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const ok = await register(form);
    setSubmitting(false);
    if (ok) navigate("/login");
  };

  return (
    <div className="auth-screen">
      <GaugePanel
        eyebrow="Skyline Weather"
        title="Every place you check, remembered."
        tagline="Create an account to pin favorite locations on the map and revisit past searches anytime."
      />

      <div className="form-panel">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <h2 className="form-card__heading">Create your account</h2>
          <p className="form-card__subheading">Takes less than a minute.</p>

          {error && <div className="form-error">{error}</div>}

          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>

          <p className="form-switch">
            Already have an account?{" "}
            <Link to="/login" onClick={() => setError(null)}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

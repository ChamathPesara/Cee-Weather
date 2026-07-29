import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On first load, restore session from a stored token
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("weatherAppToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (err) {
        localStorage.removeItem("weatherAppToken");
        localStorage.removeItem("weatherAppUser");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("weatherAppToken", data.token);
    const { token, ...userInfo } = data;
    localStorage.setItem("weatherAppUser", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const register = async ({ name, email, password }) => {
    setError(null);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      persistSession(data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      return false;
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      persistSession(data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("weatherAppToken");
    localStorage.removeItem("weatherAppUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

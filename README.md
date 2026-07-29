<div align="center">

# 🌦️ Cee-Weather

**A full-stack MERN weather app — search, map, and remember every forecast you've ever checked.**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![OpenWeather](https://img.shields.io/badge/OpenWeather-EB6E4B?style=flat&logo=openweathermap&logoColor=white)](https://openweathermap.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## Overview

Cee-Weather is a MERN-stack weather application built around one idea: checking the
weather shouldn't mean re-typing the same city every time, or losing track of what you
looked up last week. It combines city search, a map-based location picker, and a
per-user history — all behind proper JWT authentication.

Search any place by name or drop a pin on the map, pick a time (now, an upcoming
forecast, or a past date), and Cee-Weather automatically picks the right OpenWeather
endpoint for that request and logs it to your account.

## ✨ Features

- 🔐 **Authentication** — register/login with hashed passwords and JWT sessions that persist across reloads
- 🔍 **Smart search** — look up any city by name, with an optional date/time
- 🕰️ **Time-aware weather** — automatically routes to current conditions, a 5-day forecast, or historical data depending on what you ask for
- 🗺️ **Map picker** — click anywhere on an interactive map to check the weather there, with the location's real name resolved automatically
- 📜 **Search history** — every lookup is saved to your account, viewable and deletable anytime
- ⭐ **Favorites** — save cities you check often for quick access
- 🎨 **Polished UI** — a distinct "barometric" visual identity across auth and dashboard screens

## 🛠️ Tech stack

| Layer        | Technology                                      |
|--------------|--------------------------------------------------|
| Frontend     | React, React Router, Axios, React-Leaflet        |
| Backend      | Node.js, Express                                 |
| Database     | MongoDB with Mongoose                            |
| Auth         | JWT + bcrypt                                     |
| Weather data | OpenWeather (Geocoding, Current, Forecast, One Call 4.0) |
| Maps         | Leaflet + OpenStreetMap tiles                    |

## 📁 Project structure

```
Cee-Weather/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── weatherController.js
│   │   ├── historyController.js
│   │   └── favoritesController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── weatherRoutes.js
│   │   ├── historyRoutes.js
│   │   └── favoritesRoutes.js
│   ├── utils/openWeatherClient.js
│   ├── server.js
│   └── .env.example
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── GaugePanel.jsx
        │   ├── WeatherSearch.jsx
        │   └── WeatherResult.jsx
        ├── pages/
        │   ├── Login.jsx / Register.jsx
        │   ├── Home.jsx
        │   ├── Search.jsx
        │   ├── MapPicker.jsx
        │   └── History.jsx
        └── App.jsx
```

## 🚀 Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free [OpenWeather](https://openweathermap.org/api) API key

### 1. Clone and install

```bash
git clone https://github.com/ChamathPesara/Cee-Weather.git
cd Cee-Weather

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weather-app
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
OPENWEATHER_API_KEY=your_openweather_api_key_here
CLIENT_URL=http://localhost:3000
```

> **Note on historical weather:** past-date lookups use OpenWeather's One Call 4.0
> hourly timeline, which requires the "One Call by Call" plan on your OpenWeather
> account (free up to 1,000 calls/day, but billing details must be added first).
> Current conditions and the 5-day forecast work on the plain free-tier key.

### 3. Run it

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

Visit `http://localhost:3000`, register an account, and start searching.

## 📡 API reference

| Method | Route                          | Auth | Description                                        |
|--------|----------------------------------|------|------------------------------------------------------|
| POST   | `/api/auth/register`            | No   | Create an account                                     |
| POST   | `/api/auth/login`                | No   | Log in                                                |
| GET    | `/api/auth/me`                   | Yes  | Current user profile                                  |
| GET    | `/api/weather/geocode?q=`        | Yes  | Resolve a place name to coordinates                   |
| GET    | `/api/weather/search?q=&time=`   | Yes  | Weather by city name/coordinates, optional time       |
| GET    | `/api/history`                   | Yes  | List search history                                   |
| DELETE | `/api/history/:index`            | Yes  | Remove a history entry                                |
| DELETE | `/api/history`                   | Yes  | Clear all history                                     |
| GET    | `/api/favorites`                 | Yes  | List saved cities                                     |
| POST   | `/api/favorites`                 | Yes  | Save a city                                           |
| DELETE | `/api/favorites/:index`          | Yes  | Remove a saved city                                   |

## 🎨 Preview

### 1. Register
<img width="956" height="500" alt="Screenshot 2026-07-29 135717" src="https://github.com/user-attachments/assets/27f22430-8bcf-4df8-839c-03b3b0a773fb" />

### 2. Login
<img width="959" height="502" alt="Screenshot 2026-07-29 135803" src="https://github.com/user-attachments/assets/e55eddaf-ee8a-415c-ad48-e03bfbe464b4" />

### 3. Home
<img width="959" height="502" alt="Screenshot 2026-07-29 135840" src="https://github.com/user-attachments/assets/0da83b0b-3399-4236-ad0d-13c96c8ccd77" />

### 4. Search by Location and Time
<img width="959" height="476" alt="Screenshot 2026-07-29 135954" src="https://github.com/user-attachments/assets/e8370459-78b8-422a-8242-a7bb1f5c7b10" />
<img width="959" height="502" alt="Screenshot 2026-07-29 140105" src="https://github.com/user-attachments/assets/80c0466e-1131-462f-89e3-9a117cc74fab" />

### 5. Pick a location from Map
<img width="959" height="502" alt="Screenshot 2026-07-29 140148" src="https://github.com/user-attachments/assets/c1b42fa6-5c35-4784-aa07-9f38b87a49df" />
<img width="959" height="502" alt="Screenshot 2026-07-29 140305" src="https://github.com/user-attachments/assets/ee64036e-f827-4ce7-9a61-308871052e61" />

### 6. User History
<img width="959" height="502" alt="Screenshot 2026-07-29 140338" src="https://github.com/user-attachments/assets/c960c06f-b762-4db8-a56b-52e5f342665e" />


## 🗺️ Roadmap

- [x] Authentication (JWT, protected routes)
- [x] Weather search by name/coordinates, time-aware
- [x] Search history
- [x] Favorites API
- [x] Map-based location picker
- [ ] Favorites UI on the dashboard
- [ ] Multi-day historical trend charts

## 📄 License

MIT — free to use, modify, and learn from.

---

<div align="center">
Built by <a href="https://github.com/ChamathPesara">Chamath Pesara</a>
</div>

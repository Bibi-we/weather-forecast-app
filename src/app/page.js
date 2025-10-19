"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // 🌤 React states for weather data, loading, and errors
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌍 London coordinates
  const lat = 51.5072;
  const lon = -0.1276;

  // 🔑 Your API key stored securely in .env.local
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

  // ⛅ Fetch weather data when the component first loads
  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  // 🧭 Handle loading and errors
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  // ✅ Main UI layout
  return (
    <main className="min-h-screen p-6 bg-sky-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        5-Day Weather Forecast — London
      </h1>

      {/* Grid container for forecast cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from(
          new Map(
            data.list.map((item) => [
              // Convert timestamp → readable date string (e.g., "Sat, Oct 19")
              new Date(item.dt * 1000).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              item, // the forecast entry
            ])
          ).values() // get only one item per date
        )
          .slice(0, 5) // show 5 unique days
          .map((day) => {
            // 🎨 Card-level dynamic background based on weather type
            const weatherType = day.weather[0].main.toLowerCase();
            const cardBg =
              weatherType.includes("rain")
                ? "from-blue-200 to-blue-500"
                : weatherType.includes("cloud")
                ? "from-gray-200 to-gray-400"
                : weatherType.includes("clear")
                ? "from-yellow-100 to-orange-300"
                : "from-sky-100 to-blue-300";

            return (
              <div
                key={day.dt}
                className={`bg-gradient-to-br ${cardBg} p-4 rounded-lg shadow flex flex-col items-center
                  transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
              >
                {/* 📅 Date */}
                <p className="font-semibold">
                  {new Date(day.dt * 1000).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {/* 🌤 Weather icon */}
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />

                {/* ☁️ Description */}
                <p className="capitalize">{day.weather[0].description}</p>

                {/* 🌡️ Temperature */}
                <p>🌡️ {Math.round(day.main.temp)}°C</p>

                {/* 💨 Wind speed */}
                <p>💨 {Math.round(day.wind.speed)} m/s</p>
              </div>
            );
          })}
      </div>
    </main>
  );
}
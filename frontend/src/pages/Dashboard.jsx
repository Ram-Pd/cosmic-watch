import { useEffect, useState } from "react";
import axios from "axios";

import LiveMonitoring from "../components/LiveMonitoring";
import RiskChart from "../components/RiskChart";
import AsteroidOrbit3D from "../components/AsteroidOrbit3D";
import { ChatWidget } from "../components/ChatWidget";

export default function Dashboard() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);

  const API =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch asteroid data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${API}/api/asteroids/feed`
        );

        setAsteroids(res.data?.asteroids || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ---------- Stats ---------- */
  const hazardousCount = asteroids.filter(
    (a) => a.hazardous
  ).length;

  const avgVelocity =
    asteroids.length > 0
      ? (
          asteroids.reduce(
            (sum, a) => sum + (a.velocity || 0),
            0
          ) / asteroids.length
        ).toFixed(2)
      : "0";

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-bold tracking-wide">
        🚀 COSMIC WATCH DASHBOARD
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-gray-700 rounded-2xl p-5 shadow-lg">
          <p className="text-gray-400">Total Asteroids</p>
          <h2 className="text-3xl font-bold">
            {asteroids.length}
          </h2>
        </div>

        <div className="bg-white/5 border border-red-700 rounded-2xl p-5 shadow-lg">
          <p className="text-gray-400">Hazardous</p>
          <h2 className="text-3xl font-bold text-red-400">
            {hazardousCount}
          </h2>
        </div>

        <div className="bg-white/5 border border-blue-700 rounded-2xl p-5 shadow-lg">
          <p className="text-gray-400">Avg Velocity</p>
          <h2 className="text-3xl font-bold text-blue-400">
            {avgVelocity} km/s
          </h2>
        </div>
      </div>

      {/* Main Mission Control Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* 3D Orbit */}
          <div className="bg-white/5 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-2xl mb-4">
              🌍 3D Orbit Visualization
            </h2>
            <AsteroidOrbit3D asteroids={asteroids} />
          </div>

          {/* Risk Chart */}
          <div className="bg-white/5 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-2xl mb-4">
              📊 Risk Distribution
            </h2>

            {loading ? (
              <p className="text-gray-400">
                Loading chart...
              </p>
            ) : (
              <RiskChart data={asteroids} />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Live Monitoring */}
          <div className="bg-white/5 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-2xl mb-4">
              🔴 Live Monitoring
            </h2>
            <LiveMonitoring />
          </div>

          {/* Live Chat */}
          <div className="bg-white/5 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-2xl mb-4">
              💬 Live Chat
            </h2>
            <ChatWidget userName="Astronaut" />
          </div>
        </div>
      </div>
    </div>
  );
}

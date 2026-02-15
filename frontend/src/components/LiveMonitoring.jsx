import { useEffect, useState } from "react";
import axios from "axios";
import RiskChart from "../components/RiskChart";

export default function LiveMonitoring() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch live asteroid data
  const fetchAsteroids = async () => {
    try {
      setError("");

      const res = await axios.get(`${API}/api/asteroids/feed`);

      if (res.data?.asteroids) {
        setAsteroids(res.data.asteroids);
      } else {
        setError("No asteroid data available");
      }
    } catch (err) {
      console.error("LIVE MONITOR ERROR:", err.message);
      setError("INTERNAL SERVER ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();

    // auto-refresh every 60 sec
    const interval = setInterval(fetchAsteroids, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      {/* Heading */}
      <h1 className="text-4xl text-center mb-8 tracking-wide">
        LIVE MONITORING
      </h1>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400">
          Loading asteroid data...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto border border-red-500 text-red-400 text-center py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Risk Chart */}
          <div className="mb-10">
            <RiskChart data={asteroids} />
          </div>

          {/* Asteroid List */}
          <div className="grid md:grid-cols-2 gap-4">
            {asteroids.slice(0, 10).map((a) => (
              <div
                key={a.id}
                className="border border-gray-700 rounded-xl p-4 bg-black/30"
              >
                <h2 className="text-lg font-semibold">
                  {a.name}
                </h2>

                <p className="text-sm text-gray-300">
                  Velocity:{" "}
                  {a.velocity
                    ? `${a.velocity.toFixed(2)} km/s`
                    : "Unknown"}
                </p>

                <p className="text-sm text-gray-300">
                  Miss Distance:{" "}
                  {a.miss_distance
                    ? `${Number(a.miss_distance).toLocaleString()} km`
                    : "Unknown"}
                </p>

                <p
                  className={`text-sm mt-2 ${
                    a.hazardous
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {a.hazardous
                    ? "⚠ Potentially Hazardous"
                    : "Safe"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

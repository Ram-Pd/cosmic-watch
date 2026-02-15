import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  export default function RiskChart({ data }) {
    if (!data || data.length === 0) return null;
  
    const chartData = data.slice(0, 10).map((a) => ({
      name: a.name?.slice(0, 8),
      risk: a.miss_distance
        ? 1000000 / Number(a.miss_distance)
        : 0,
    }));
  
    return (
      <div className="w-full h-80 bg-black/30 rounded-xl p-4">
        <h2 className="text-white mb-3">Risk Distribution</h2>
  
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="risk" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
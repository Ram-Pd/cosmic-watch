import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAsteroidRisk } from '../services/api';

const LEVEL_COLORS = {
  LOW: 'border-emerald-500/50 text-emerald-400',
  MODERATE: 'border-amber-500/50 text-amber-400',
  HIGH: 'border-orange-500/50 text-orange-400',
  CRITICAL: 'border-red-500/50 text-red-400',
};

export function RiskAnalysis() {
  const [data, setData] = useState({ LOW: [], MODERATE: [], HIGH: [], CRITICAL: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAsteroidRisk()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load risk');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map((level) => (
          <div key={level} className="border border-cosmic-border rounded p-6 animate-pulse h-40" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/30 rounded p-8 text-center text-red-400">
        <p className="uppercase tracking-wider text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map((level, idx) => (
        <motion.div
          key={level}
          className={`border rounded p-6 ${LEVEL_COLORS[level] || 'border-cosmic-border'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <h3 className="font-display text-lg uppercase tracking-widest mb-2">{level}</h3>
          <p className="text-2xl font-light">{data[level]?.length ?? 0}</p>
          <p className="text-cosmic-muted text-sm mt-2">objects</p>
        </motion.div>
      ))}
    </div>
  );
}

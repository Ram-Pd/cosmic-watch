import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { login } from '../services/api';
import { Button } from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      loginSuccess(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center px-6 py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl uppercase tracking-widest text-white mb-8 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-400 text-sm uppercase tracking-wider">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="block text-cosmic-muted text-sm uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-cosmic-gray border border-cosmic-border px-4 py-3 text-white placeholder-cosmic-muted focus:outline-none focus:border-white transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-cosmic-muted text-sm uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-cosmic-gray border border-cosmic-border px-4 py-3 text-white placeholder-cosmic-muted focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-center text-cosmic-muted text-sm">
          No account? <Link to="/register" className="text-white hover:underline">Register</Link>
        </p>
      </div>
    </motion.div>
  );
}

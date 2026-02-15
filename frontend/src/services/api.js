import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(err);
  }
);

export async function register(name, email, password) {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/api/auth/profile');
  return data;
}

export async function getAsteroidFeed(date) {
  const params = date ? { date } : {};
  const { data } = await api.get('/api/asteroids/feed', { params });
  return data;
}

export async function getAsteroidById(id) {
  const { data } = await api.get(`/api/asteroids/${id}`);
  return data;
}

export async function getAsteroidRisk(date) {
  const params = date ? { date } : {};
  const { data } = await api.get('/api/asteroids/risk', { params });
  return data;
}

export async function getAlerts() {
  const { data } = await api.get('/api/alerts');
  return data;
}

export async function getChatRecent() {
  const { data } = await api.get('/api/chat/recent');
  return data;
}

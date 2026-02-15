import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_EXPIRES = '7d';

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/** POST /api/auth/register */
export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, watchedAsteroids: user.watchedAsteroids, alertSettings: user.alertSettings },
  });
}

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, watchedAsteroids: user.watchedAsteroids, alertSettings: user.alertSettings },
  });
}

/** GET /api/auth/profile – protected */
export async function profile(req, res) {
  res.json({ user: req.user });
}

/** PATCH /api/auth/profile – protected; update watchedAsteroids, alertSettings */
export async function updateProfile(req, res) {
  const { watchedAsteroids, alertSettings } = req.body;
  const update = {};
  if (Array.isArray(watchedAsteroids)) update.watchedAsteroids = watchedAsteroids;
  if (alertSettings && typeof alertSettings === 'object') {
    update.alertSettings = { ...req.user.alertSettings, ...alertSettings };
  }
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
  res.json({ user });
}

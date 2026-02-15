import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config(); // also load from process.cwd() (e.g. root .env when running from root)

import 'express-async-errors';
import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { Server as SocketServer } from 'socket.io';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import asteroidsRoutes from './routes/asteroids.js';
import alertsRoutes from './routes/alerts.js';
import { runAlertCheck } from './services/alertService.js';
import { getRecentMessages, saveAndBroadcast } from './services/chatService.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: true } });

const PORT = process.env.PORT || 5000;
const ASTEROID_ROOM = 'asteroid';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/asteroids', asteroidsRoutes);
app.use('/api/alerts', alertsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'cosmic-watch-api' });
});

app.get('/api/chat/recent', async (req, res) => {
  const messages = await getRecentMessages();
  res.json({ messages: messages.reverse() });
});

app.use(errorHandler);

io.on('connection', async (socket) => {
  socket.join(ASTEROID_ROOM);
  try {
    const messages = await getRecentMessages();
    socket.emit('messages', messages.reverse());
  } catch (err) {
    console.error('Chat history load failed:', err);
  }
  socket.on('message', async (payload) => {
    if (!payload?.user || !payload?.text || typeof payload.text !== 'string') return;
    const text = payload.text.slice(0, 500);
    try {
      await saveAndBroadcast(io, ASTEROID_ROOM, { user: payload.user, text });
    } catch (err) {
      console.error('Chat save failed:', err);
    }
  });
});

async function start() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmic-watch';
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');

  cron.schedule('0 * * * *', async () => {
    try {
      await runAlertCheck();
      console.log('Alert check completed');
    } catch (err) {
      console.error('Alert check failed:', err);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});

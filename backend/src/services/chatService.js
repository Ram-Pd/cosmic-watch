import ChatMessage from '../models/ChatMessage.js';
import { CHAT_MESSAGE_LIMIT } from '../utils/constants.js';

export async function getRecentMessages() {
  return ChatMessage.find().sort({ createdAt: -1 }).limit(CHAT_MESSAGE_LIMIT).lean();
}

export async function saveAndBroadcast(io, room, payload) {
  const doc = await ChatMessage.create({ user: payload.user, text: payload.text });
  const msg = { id: doc._id, user: doc.user, text: doc.text, createdAt: doc.createdAt };
  io.to(room).emit('message', msg);
  return msg;
}

import mongoose from 'mongoose';
import { CHAT_MESSAGE_LIMIT } from '../utils/constants.js';

const chatMessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

/** After save, keep only last CHAT_MESSAGE_LIMIT messages */
chatMessageSchema.post('save', async function () {
  const count = await mongoose.model('ChatMessage').countDocuments();
  if (count > CHAT_MESSAGE_LIMIT) {
    const oldest = await mongoose.model('ChatMessage').find().sort({ createdAt: 1 }).limit(count - CHAT_MESSAGE_LIMIT).select('_id');
    await mongoose.model('ChatMessage').deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
  }
});

export default mongoose.model('ChatMessage', chatMessageSchema);

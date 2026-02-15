import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asteroidId: { type: String, required: true },
  asteroidName: { type: String, required: true },
  closeApproachDate: { type: String },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

alertSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Alert', alertSchema);

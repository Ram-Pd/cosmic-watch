import Alert from '../models/Alert.js';

/** GET /api/alerts – protected, returns alerts for current user */
export async function list(req, res) {
  const alerts = await Alert.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json({ alerts });
}

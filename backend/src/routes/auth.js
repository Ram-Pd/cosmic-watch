import { Router } from 'express';
import { register, login, profile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile);
router.patch('/profile', protect, updateProfile);

export default router;

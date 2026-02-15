import { Router } from 'express';
import { feed, getById, risk } from '../controllers/asteroidsController.js';

const router = Router();

router.get('/feed', feed);
router.get('/risk', risk);
router.get('/:id', getById);

export default router;

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getNearbyUserForSwipe } from '../controller/swipeController.js';

const router = express.Router()

router.route('/').get(protect, getNearbyUserForSwipe)

export default router
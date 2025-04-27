import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { matchUserForEvent } from '../controller/matchController.js';

const router = express.Router()

router.route('/').post(protect, matchUserForEvent)

export default router
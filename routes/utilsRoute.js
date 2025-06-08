import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserPreference } from '../controller/utilsController.js';

const router = express.Router()

router.route('/').get(protect, getUserPreference)

export default router
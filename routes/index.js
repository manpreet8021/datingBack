import express from 'express';
import { adminProtect, protect } from '../middleware/authMiddleware.js';
import LookUpRoute from './lookUpRoute.js';

const router = express.Router();
router.use('/lookup', LookUpRoute)

export default router
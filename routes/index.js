import express from 'express';
import { adminProtect, protect } from '../middleware/authMiddleware.js';
import LookUpRoute from './lookUpRoute.js';
import AuthRoute from './authRoute.js';

const router = express.Router();
router.use('/lookup', LookUpRoute)
router.use('/auth', AuthRoute)

export default router
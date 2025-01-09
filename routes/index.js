import express from 'express';
import { adminProtect, protect } from '../middleware/authMiddleware.js';


const router = express.Router();

export default router
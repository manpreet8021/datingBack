import express from 'express';
import LookUpRoute from './lookUpRoute.js';
import AuthRoute from './authRoute.js';

const router = express.Router();
router.use('/lookup', LookUpRoute)
router.use('/auth', AuthRoute)

export default router
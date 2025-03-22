import express from 'express';
import LookUpRoute from './lookUpRoute.js';
import AuthRoute from './authRoute.js';
import EventRoute from './eventRoute.js'

const router = express.Router();
router.use('/lookup', LookUpRoute)
router.use('/auth', AuthRoute)
router.use('/event', EventRoute)

export default router
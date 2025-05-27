import express from 'express';
import LookUpRoute from './lookUpRoute.js';
import AuthRoute from './authRoute.js';
import EventRoute from './eventRoute.js'
import MatchRoute from './matchRoute.js'
import SwipeRoute from './swipeRoute.js'

const router = express.Router();
router.use('/lookup', LookUpRoute)
router.use('/auth', AuthRoute)
router.use('/event', EventRoute)
router.use('/match', MatchRoute)
router.use('/swipe', SwipeRoute)

export default router
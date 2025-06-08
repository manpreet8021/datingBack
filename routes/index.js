import express from 'express';
import LookUpRoute from './lookUpRoute.js';
import AuthRoute from './authRoute.js';
import EventRoute from './eventRoute.js'
import MatchRoute from './matchRoute.js'
import SwipeRoute from './swipeRoute.js'
import UtilsRoute from './utilsRoute.js'

const router = express.Router();
router.use('/lookup', LookUpRoute)
router.use('/auth', AuthRoute)
router.use('/event', EventRoute)
router.use('/match', MatchRoute)
router.use('/swipe', SwipeRoute)
router.use('/route', UtilsRoute)

export default router
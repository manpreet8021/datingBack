import express from 'express';
import { getEvents, insertEventDetail, updateEventDetail, likeEvent } from '../controller/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router()

router.route('/').get(getEvents)
router.route('/').post(protect, insertEventDetail)
router.route('/').put(protect, updateEventDetail)
router.route('/like/:eventid').put(protect, likeEvent)

export default router
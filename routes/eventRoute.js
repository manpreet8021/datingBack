import express from 'express';
import { getEvents, insertEventDetail, updateEventDetail, getEventByIdController, getLoggedInUserEvent } from '../controller/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router()

router.route('/').get(protect, getEvents)
router.route('/').post(protect, upload.single('thumbnail'), insertEventDetail)
router.route('/').put(protect, upload.single('thumbnail'), updateEventDetail)
router.route('/userEvent').get(protect, getLoggedInUserEvent)
router.route('/:eventId').get(protect, getEventByIdController)

export default router
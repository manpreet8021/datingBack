import express from 'express';
import { getEvents, insertEventDetail, updateEventDetail, getEventByIdController } from '../controller/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router()

router.route('/').get(protect, getEvents)
router.route('/').post(protect, upload.single('thumbnail'), insertEventDetail)
router.route('/').put(protect, updateEventDetail)
router.route('/:eventId').get(protect, getEventByIdController)

export default router
import express from 'express';
import { getEvents, insertEvent } from '../controller/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router()

router.route('/').get(getEvents)
router.route('/').post(protect, upload.single('thumbnail'), insertEvent)

export default router
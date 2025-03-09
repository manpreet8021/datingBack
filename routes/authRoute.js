import express from 'express';
import { sendOtp, validateOtp, googleLogin, updateUserDetail } from '../controller/authController.js';
import { upload } from '../middleware/multerMiddleware.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router()

router.route('/sendOtp').post(sendOtp)
router.route('/validateOtp').post(validateOtp)
router.route('/googleLogin').post(googleLogin)
router.route('/updateUserDetail').post(protect, upload.array('image', 5), updateUserDetail)

export default router
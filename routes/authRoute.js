import express from 'express';
import { sendOtp, validateOtp, googleLogin, updateUserDetail, insertUserLocation } from '../controller/authController.js';
import { upload } from '../middleware/multerMiddleware.js'
import { protect, protectAuth } from '../middleware/authMiddleware.js';

const router = express.Router()

router.route('/sendOtp').post(sendOtp)
router.route('/validateOtp').post(validateOtp)
router.route('/googleLogin').post(googleLogin)
router.route('/insertUserLocation').post(protect, insertUserLocation)
router.route('/').put(protectAuth, upload.fields([{name: 'image', maxCount: 5}, {name: 'profile', maxCount: 1}]), updateUserDetail)

export default router
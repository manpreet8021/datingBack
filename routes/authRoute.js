import express from 'express';
import { sendOtp, validateOtp, googleLogin } from '../controller/authController.js';

const router = express.Router()

router.route('/sendOtp').post(sendOtp)
router.route('/validateOtp').post(validateOtp)
router.route('/googleLogin').post(googleLogin)

export default router
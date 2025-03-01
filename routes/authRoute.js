import express from 'express';
import { sendOtp, validateOtp } from '../controller/authController.js';

const router = express.Router()

router.route('/sendOtp').post(sendOtp)
router.route('/validateOtp').post(validateOtp)

export default router
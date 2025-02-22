import express from 'express';
import { addLookUpData } from '../controller/lookupController.js';

const router = express.Router()

router.route('/').post(addLookUpData)

export default router
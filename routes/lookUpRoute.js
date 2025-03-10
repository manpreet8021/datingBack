import express from 'express';
import { addLookUpData } from '../controller/lookupController.js';
import { getLookUpValues } from '../controller/lookupController.js';

const router = express.Router()

router.route('/').post(addLookUpData)
router.route('/:data').get(getLookUpValues)

export default router
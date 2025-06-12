import express from 'express';
import {
  addSupporters,
  getSupporters,
  updateSupporter,
} from '../controllers/supporter.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:causeId', protect, addSupporters);
router.get('/:causeId', protect, getSupporters);
router.patch('/update/:id', protect, updateSupporter);

export default router;

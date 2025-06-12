import express from 'express';
import {
  createAdvocacy,
  getAllAdvocacies,
  getAdvocacyById,
  updateAdvocacy,
  deleteAdvocacy,
  uploadAdvocacyImage,
  updateAdvocacyResources,
} from '../controllers/advocacy.controller.js';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';
import { parseFileUpload } from '../utils/cloudinaryUpload.js';

const router = express.Router();

// Public routes
router.get('/', getAllAdvocacies);
router.get('/:id', getAdvocacyById);

// Admin-protected routes
router.post('/', protect, isAdmin, createAdvocacy);
router.put('/:id', protect, isAdmin, updateAdvocacy);
router.delete('/:id', protect, isAdmin, deleteAdvocacy);
router.put('/:id/resources', protect, isAdmin, updateAdvocacyResources);
router.post('/upload-image', protect, parseFileUpload('file'), uploadAdvocacyImage);

export default router;

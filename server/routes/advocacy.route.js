import express from 'express';
import multer from 'multer';
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

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/', getAllAdvocacies);
router.get('/:id', getAdvocacyById);

// Admin-protected routes
router.post('/', protect, isAdmin, createAdvocacy);
router.put('/:id', protect, isAdmin, updateAdvocacy);
router.delete('/:id', protect, isAdmin, deleteAdvocacy);
router.put('/:id/resources', protect, isAdmin, updateAdvocacyResources);
router.post('/upload-image', protect, upload.single('file'), uploadAdvocacyImage);

export default router;

import express from 'express';
import multer from 'multer';
import {
  createCause,
  joinCause,
  getOwnedCauses,
  getJoinedCauses,
  deleteCause,
  updateCause,
  getCauseById,
  uploadCauseBannerImage,
  getCauseByJoinCode,
  uploadRichDescriptionImage,
  getAllCauses,
} from '../controllers/cause.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all causes in the platform
router.get('/', getAllCauses);

// Create new cause (KYC protected)
router.post('/', protect, createCause);

// Get all causes owned by current user
router.get('/owned', protect, getOwnedCauses);

// Get all causes user has joined
router.get('/joined', protect, getJoinedCauses);

// Join a cause via join code
router.post('/join/:code', protect, joinCause);

// Delete a cause (only if you're the creator)
router.delete('/:id', protect, deleteCause);

// Update editable fields of a cause
router.patch('/:id', protect, updateCause);

// Get a single cause by ID
router.get('/:id', protect, getCauseById);

router.post('/upload-image', protect, upload.single('file'), uploadCauseBannerImage);

router.post('/upload-rich-description-image', protect, upload.single('file'), uploadRichDescriptionImage);

router.get('/code/:code', getCauseByJoinCode);



export default router;

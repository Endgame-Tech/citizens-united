import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadProfileImage, updateMe } from '../controllers/user.controller.js'
import { parseFileUpload } from '../utils/cloudinaryUpload.js';

const router = express.Router();

// Use serverless-compatible file upload middleware instead of multer
router.post('/upload-profile-image', protect, parseFileUpload('file'), uploadProfileImage);
router.patch('/me', protect, updateMe);

export default router;

import express from 'express';
import multer from 'multer';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadProfileImage, updateMe } from '../controllers/user.controller.js'

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-profile-image', protect, upload.single('file'), uploadProfileImage);
router.patch('/me', protect, updateMe);

export default router;

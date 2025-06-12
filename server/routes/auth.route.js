import express from 'express';
import {
  registerUser,
  loginUser,
  confirmEmail,
  forgotPassword,
  resetPassword,
  logoutUser,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/confirm-email/:token', confirmEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logoutUser);
router.get("/me", protect, getCurrentUser);


export default router;

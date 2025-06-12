import express from "express";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // adjust to your actual middleware file

const router = express.Router();


// Get notifications for the logged-in user
router.get("/", protect, getNotifications);

// Mark a specific notification as read
router.put("/:id/read", protect, markAsRead);

router.delete("/:id", protect, deleteNotification);

export default router;

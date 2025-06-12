// routes/stateOfNationImage.routes.js
import express from "express";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllImages,
  uploadImage,
  deleteImage,
  updateImage,
  updateImagesOrder
} from "../controllers/stateOfNationImage.controller.js";
import { parseFileUpload } from '../utils/cloudinaryUpload.js';

const router = express.Router();

// Anyone can view
router.get("/", getAllImages);

// Only admin can upload, update or delete - using serverless-compatible file middleware
router.post("/", protect, isAdmin, parseFileUpload("image"), uploadImage);
router.put("/order", protect, isAdmin, updateImagesOrder);
router.put("/:id", protect, isAdmin, parseFileUpload("image"), updateImage);
router.delete("/:id", protect, isAdmin, deleteImage);

export default router;

// routes/stateOfNationImage.routes.js
import express from "express";
import multer from "multer";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllImages,
  uploadImage,
  deleteImage,
  updateImage,
  updateImagesOrder
} from "../controllers/stateOfNationImage.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploads

// Anyone can view
router.get("/", getAllImages);

// Only admin can upload, update or delete
router.post("/", protect, isAdmin, upload.single("image"), uploadImage);
router.put("/order", protect, isAdmin, updateImagesOrder);
router.put("/:id", protect, isAdmin, upload.single("image"), updateImage);
router.delete("/:id", protect, isAdmin, deleteImage);

export default router;

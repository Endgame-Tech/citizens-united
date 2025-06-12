// controllers/stateOfNationImage.controller.js
import StateOfNationImage from "../models/stateOfNationImage.model.js";
import cloudinary from "../config/cloudinary.js";

export const getAllImages = async (req, res) => {
  try {
    // Sort by order field first, then by createdAt descending as backup
    const images = await StateOfNationImage.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching images" });
  }
};

import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let result;

    if (req.file.buffer) {
      // Serverless environment - upload buffer directly
      result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "citizens-united/state-of-nation"
      });
    } else if (req.file.path) {
      // Development environment - upload from path
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "citizens-united/state-of-nation"
      });
    } else {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    const newImage = await StateOfNationImage.create({
      imageUrl: result.secure_url,
      uploadedBy: req.user._id,
    });
    res.status(201).json(newImage);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await StateOfNationImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // Optionally: Delete from cloudinary using public_id (extract from URL if needed)
    await StateOfNationImage.deleteOne({ _id: req.params.id });
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const updateImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imageId = req.params.id;
    const image = await StateOfNationImage.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Upload new image to cloudinary
    let result;

    if (req.file.buffer) {
      // Serverless environment - upload buffer directly
      result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "citizens-united/state-of-nation"
      });
    } else if (req.file.path) {
      // Development environment - upload from path
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "citizens-united/state-of-nation"
      });
    } else {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    // Update the image record
    const updatedImage = await StateOfNationImage.findByIdAndUpdate(
      imageId,
      { imageUrl: result.secure_url },
      { new: true }
    );

    res.json(updatedImage);
  } catch (err) {
    console.error('Update image error:', err);
    res.status(500).json({ message: "Update failed" });
  }
};

export const updateImagesOrder = async (req, res) => {
  try {
    const { imageIds } = req.body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return res.status(400).json({ message: "Invalid input: imageIds array required" });
    }

    // Update each image with its new order
    const updatePromises = imageIds.map((id, index) => {
      return StateOfNationImage.findByIdAndUpdate(id, { order: index }, { new: true });
    });

    const updatedImages = await Promise.all(updatePromises);
    res.json(updatedImages);
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ message: "Failed to update image order" });
  }
};

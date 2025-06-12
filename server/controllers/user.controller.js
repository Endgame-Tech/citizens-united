import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';

import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let result;

    if (req.file.buffer) {
      // Serverless environment - upload buffer directly
      result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'profile_images',
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
      });
    } else if (req.file.path) {
      // Development environment - upload from path
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images',
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
      });
    } else {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    // Update user's profile image URL
    await User.findByIdAndUpdate(req.userId, { profileImage: result.secure_url });
    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

// PATCH /users/me - update user profile (including survey fields)
export const updateMe = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Only update allowed fields (including nested personalInfo)
    if (updates.personalInfo) {
      user.personalInfo = { ...user.personalInfo, ...updates.personalInfo };
      // If all survey fields are present and non-empty, set hasTakenCauseSurvey to true
      const { citizenship, isVoter, willVote } = updates.personalInfo;
      if (
        typeof citizenship === 'string' && citizenship &&
        typeof isVoter === 'string' && isVoter &&
        typeof willVote === 'string' && willVote
      ) {
        user.hasTakenCauseSurvey = true;
      }
    }
    // Add other top-level fields if needed
    await user.save();
    res.json({ user });
  } catch (err) {
    console.error('UpdateMe error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

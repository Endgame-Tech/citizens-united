import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';

export const uploadProfileImage = async (req, res) => {
  try {
    const fileStr = req.file.path; // using multer to temp store
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: 'profile_images',
      transformation: [{ width: 500, height: 500, crop: 'fill' }]
    });
    // cleanup multer temp file if needed
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

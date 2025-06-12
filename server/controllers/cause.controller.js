import Cause from '../models/cause.model.js';
import User from '../models/user.model.js';
import Supporter from '../models/supporter.model.js';
import cloudinary from '../config/cloudinary.js';

const generateJoinCode = () => {
  return Math.random().toString(36).slice(2, 10); // 8 characters
};

// Create new cause
export const createCause = async (req, res) => {
  try {
    const {
      name,
      description,
      goals,
      causeType,
      scope,
      targets,
      location,
      bannerImageUrl,
      richDescription,
      toolkits,
    } = req.body;

    const joinCode = generateJoinCode();

    const user = await User.findById(req.userId);
    if (!user || user.kycStatus !== 'approved') {
      return res.status(403).json({ message: 'KYC verification required to create a cause' });
    }

    const newCause = await Cause.create({
      name,
      description,
      goals,
      causeType,
      scope,
      targets,
      location,
      bannerImageUrl,
      richDescription,
      joinCode,
      toolkits,
      partners,
      creator: req.userId,
      supporters: [req.userId],
    });

    // Add creator as a supporter record
    await Supporter.create({
      cause: newCause._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      joinStatus: 'Active',
      decisionTag: 'Committed',
      contactStatus: 'Not Reachable',
      notes: '',
    });

    // Update user
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        ownedCauses: newCause._id,
        joinedCauses: newCause._id,
      },
    });

    res.status(201).json(newCause);
  } catch (err) {
    console.error('Create Cause Error:', err);
    res.status(500).json({ message: 'Failed to create cause' });
  }
};

// Join cause by code
export const joinCause = async (req, res) => {
  try {
    const { code } = req.params;
    const { personalInfo } = req.body; // Extract personalInfo from request body

    const cause = await Cause.findOne({ joinCode: code });
    if (!cause) return res.status(404).json({ message: 'Cause not found' });

    if (cause.supporters.includes(req.userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    cause.supporters.push(req.userId);
    await cause.save();

    const user = await User.findById(req.userId).select('name email phone personalInfo');
    if (user) {
      await Supporter.create({
        cause: cause._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        joinStatus: 'Joined',
        decisionTag: 'Undecided',
        contactStatus: 'No Response',
        notes: '',
        citizenship: personalInfo?.citizenship || user.personalInfo?.citizenship,
        isVoter: personalInfo?.isVoter || user.personalInfo?.isVoter,
      });
    }

    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedCauses: cause._id },
    });

    res.status(200).json({ message: 'Successfully joined cause' });
  } catch (err) {
    console.error('Join Cause Error:', err);
    res.status(500).json({ message: 'Failed to join cause' });
  }
};

// Get all causes in the platform
export const getAllCauses = async (req, res) => {
  try {
    const causes = await Cause.find().sort({ createdAt: -1 });
    res.status(200).json(causes);
  } catch (err) {
    console.error('Get All Causes Error:', err);
    res.status(500).json({ message: 'Failed to fetch all causes' });
  }
};

// Get causes created by the user
export const getOwnedCauses = async (req, res) => {
  try {
    const causes = await Cause.find({ creator: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(causes);
  } catch (err) {
    console.error('Get Owned Causes Error:', err);
    res.status(500).json({ message: 'Failed to fetch owned causes' });
  }
};

// Import our cloudinary upload utility
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

// Upload Banner Image 
export const uploadCauseBannerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let result;

    if (req.file.buffer) {
      // Serverless environment - upload buffer directly
      result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'cause_banners',
        transformation: [{ width: 1200, height: 675, crop: 'fill' }]
      });
    } else if (req.file.path) {
      // Development environment - upload from path
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'cause_banners',
        transformation: [{ width: 1200, height: 675, crop: 'fill' }]
      });
    } else {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

// Upload Rich Description Image
export const uploadRichDescriptionImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let result;

    if (req.file.buffer) {
      // Serverless environment - upload buffer directly
      result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'rich_description_images',
        transformation: [{ width: 1200, height: 675, crop: 'fill' }]
      });
    } else if (req.file.path) {
      // Development environment - upload from path
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'rich_description_images',
        transformation: [{ width: 1200, height: 675, crop: 'fill' }]
      });
    } else {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

// Get causes the user joined
export const getJoinedCauses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('joinedCauses');
    res.status(200).json(user.joinedCauses);
  } catch (err) {
    console.error('Get Joined Causes Error:', err);
    res.status(500).json({ message: 'Failed to fetch joined causes' });
  }
};

// Delete cause by ID
export const deleteCause = async (req, res) => {
  try {
    const { id } = req.params;
    const cause = await Cause.findById(id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });

    if (cause.creator.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this cause' });
    }

    await User.updateMany(
      { joinedCauses: cause._id },
      { $pull: { joinedCauses: cause._id } }
    );

    await User.updateOne(
      { _id: req.userId },
      { $pull: { ownedCauses: cause._id } }
    );

    await Cause.findByIdAndDelete(id);

    res.status(200).json({ message: 'Cause and supporters removed successfully' });
  } catch (err) {
    console.error('Delete Cause Error:', err);
    res.status(500).json({ message: 'Failed to delete cause' });
  }
};

// Update cause
export const updateCause = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const cause = await Cause.findById(id);
    if (!cause) {
      console.log("Cause not found for ID:", id);
      return res.status(404).json({ message: 'Not found' });
    }
    console.log("Cause creator:", cause.creator);
    console.log("Request user ID:", req.userId);
    if (!cause.creator.equals(req.userId)) {
      console.log("Unauthorized access attempt by user:", req.userId);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(cause, updateData);
    await cause.save();
    res.status(200).json(cause);
  } catch (err) {
    console.error('Update Cause Error:', err);
    res.status(500).json({ message: 'Failed to update cause' });
  }
};

// Get a single cause by ID
export const getCauseById = async (req, res) => {
  try {
    const { id } = req.params;
    const cause = await Cause.findById(id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    res.status(200).json(cause);
  } catch (err) {
    console.error('Get Cause By ID Error:', err);
    res.status(500).json({ message: 'Failed to fetch cause' });
  }
};

// Get a single Cause by Join Code 
export const getCauseByJoinCode = async (req, res) => {
  try {
    const { code } = req.params;
    const cause = await Cause.findOne({ joinCode: code }).populate('creator');

    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }

    // Aggregate supporter metrics dynamically
    const metrics = await Supporter.aggregate([
      { $match: { cause: cause._id } },
      {
        $group: {
          _id: null,
          voters: {
            $sum: {
              $cond: [{ $eq: ['$isVoter', 'Yes'] }, 1, 0],
            },
          },
          foreigners: {
            $sum: {
              $cond: [{ $eq: ['$citizenship', 'Foreigner'] }, 1, 0],
            },
          },
          diasporans: {
            $sum: {
              $cond: [{ $eq: ['$citizenship', 'Diasporan'] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Return cause with metrics
    const causeObj = cause.toObject();
    causeObj.supporterMetrics = metrics[0] || { voters: 0, foreigners: 0, diasporans: 0 };
    res.status(200).json(causeObj);
  } catch (err) {
    console.error('Get Cause By Join Code Error:', err);
    res.status(500).json({ message: 'Failed to fetch cause by code' });
  }
};



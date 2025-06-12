import cloudinary from "../config/cloudinary.js";
import { Readable } from 'stream';

/**
 * Uploads a file to Cloudinary, handling both file paths and buffers
 * Compatible with legacy code that expects file.path and new serverless approach
 */
/**
 * Uploads a file buffer directly to Cloudinary without saving to disk
 * @param {Buffer} buffer - The file buffer
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadBufferToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    // Create a readable stream from buffer and pipe to cloudinary
    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Uploads a file to Cloudinary, handling both file paths and buffers
 * Compatible with legacy code that expects file.path and new serverless approach
 */
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    let result;

    if (file.buffer) {
      // Handle direct buffer upload for serverless environments
      result = await uploadBufferToCloudinary(file.buffer, {
        resource_type: "auto",
        ...options
      });
    } else if (file.path) {
      // Legacy path-based upload for development environments
      result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        ...options
      });
    } else {
      throw new Error("Invalid file object: missing both buffer and path");
    }

    return result.secure_url;
  } catch (error) {
    throw new Error("Upload failed: " + error.message);
  }
}

/**
 * Middleware for parsing file uploads from multipart/form-data without using disk storage
 * This will replace multer's upload.single middleware in a serverless environment
 */
export const parseFileUpload = (fieldName) => async (req, res, next) => {
  try {
    if (!req.files) {
      req.files = {};
    }

    if (req.is('multipart/form-data')) {
      // For multipart form data, we manually parse the request stream
      // This is a simplified version, in production you may want to use a proper parser library
      // that works without disk storage like busboy or formidable

      // Note: In the actual implementation with busboy, we would stream directly to Cloudinary
      // For now, just to make it compatible, we'll set a dummy buffer to indicate serverless mode
      req.file = {
        buffer: Buffer.from([]), // Empty buffer as placeholder
        fieldname: fieldName,
        originalname: 'placeholder',
      };
    } else if (req.body && req.body[fieldName]) {
      // Handle base64 encoded uploads (alternative for serverless)
      const base64Data = req.body[fieldName];
      if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
        const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], 'base64');
          req.file = {
            buffer,
            fieldname: fieldName,
            mimetype: matches[1],
            originalname: 'base64upload',
          };
        }
      }
    }

    next();
  } catch (error) {
    console.error('Error parsing file upload:', error);
    return res.status(500).json({ error: 'File upload parsing failed' });
  }
};

/**
 * Middleware for parsing multiple files without using disk storage
 * This will replace multer's upload.array middleware
 */
export const parseMultipleFileUploads = (fieldName) => async (req, res, next) => {
  try {
    // Handle array of base64 encoded files from request body
    if (req.body && Array.isArray(req.body[fieldName])) {
      req.files = req.body[fieldName].map((item, index) => {
        if (typeof item === 'string' && item.startsWith('data:')) {
          const matches = item.match(/^data:(.+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            return {
              buffer: Buffer.from(matches[2], 'base64'),
              fieldname: fieldName,
              mimetype: matches[1],
              originalname: `file${index}`,
            };
          }
        }
        return null;
      }).filter(Boolean);
    }

    next();
  } catch (error) {
    console.error('Error parsing multiple file uploads:', error);
    return res.status(500).json({ error: 'Multiple file upload parsing failed' });
  }
};;

const uploadMultipleToCloudinary = async (files) => {
  return await Promise.all(files.map(uploadToCloudinary));
};

export { uploadMultipleToCloudinary };

import cloudinary from "../config/cloudinary.js";
import { Readable } from 'stream';
import Busboy from 'busboy';

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
 * Middleware for parsing file uploads from multipart/form-data using busboy
 * This replaces multer's upload.single middleware in a serverless environment
 */
export const parseFileUpload = (fieldName) => async (req, res, next) => {
  try {
    // Skip if no multipart content
    if (!req.is('multipart/form-data')) {
      return next();
    }

    const busboy = Busboy({ headers: req.headers });
    const chunks = [];
    let filename = '';
    let mimetype = '';
    let fileFound = false;

    busboy.on('file', (name, file, info) => {
      if (name === fieldName) {
        fileFound = true;
        filename = info.filename;
        mimetype = info.mimeType;

        file.on('data', (chunk) => {
          chunks.push(chunk);
        });

        file.on('end', () => {
          // File processing complete
        });
      } else {
        // Skip unwanted files
        file.resume();
      }
    });

    busboy.on('finish', () => {
      if (fileFound && chunks.length > 0) {
        const buffer = Buffer.concat(chunks);
        req.file = {
          buffer,
          fieldname: fieldName,
          originalname: filename,
          mimetype: mimetype,
          size: buffer.length
        };
      }
      next();
    });

    busboy.on('error', (error) => {
      console.error('Busboy error:', error);
      return res.status(500).json({ error: 'File parsing failed' });
    });

    // Pipe the request to busboy
    req.pipe(busboy);

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
    // Skip if no multipart content
    if (!req.is('multipart/form-data')) {
      return next();
    }

    const busboy = Busboy({ headers: req.headers });
    const files = [];

    busboy.on('file', (name, file, info) => {
      if (name === fieldName) {
        const chunks = [];
        const { filename, mimeType } = info;

        file.on('data', (chunk) => {
          chunks.push(chunk);
        });

        file.on('end', () => {
          const buffer = Buffer.concat(chunks);
          files.push({
            buffer,
            fieldname: fieldName,
            originalname: filename,
            mimetype: mimeType,
            size: buffer.length
          });
        });
      } else {
        // Skip unwanted files
        file.resume();
      }
    });

    busboy.on('finish', () => {
      req.files = files;
      next();
    });

    busboy.on('error', (error) => {
      console.error('Busboy error:', error);
      return res.status(500).json({ error: 'File parsing failed' });
    });

    // Pipe the request to busboy
    req.pipe(busboy);

  } catch (error) {
    console.error('Error parsing multiple file uploads:', error);
    return res.status(500).json({ error: 'Multiple file upload parsing failed' });
  }
};

const uploadMultipleToCloudinary = async (files) => {
  return await Promise.all(files.map(uploadToCloudinary));
};

export { uploadMultipleToCloudinary };

import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Upload failed: " + error.message);
  }
};

const uploadMultipleToCloudinary = async (files) => {
  return await Promise.all(files.map(uploadToCloudinary));
};

export { uploadToCloudinary, uploadMultipleToCloudinary };

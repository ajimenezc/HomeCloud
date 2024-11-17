import dotenv from 'dotenv';
dotenv.config();
export const UPLOAD_PATH = process.env.UPLOAD_PATH

// Utility to get the full path for a specific file
export const getFilePath = (filename) => joinPaths(UPLOAD_PATH, filename);

// Utility to get the base directory for uploads
export const getUploadsDirectory = () => UPLOAD_PATH;

// Export for usage across the app
export default {
  getFilePath,
  getUploadsDirectory,
};

export const joinPaths = (...segments) => segments.filter(Boolean).join('/');
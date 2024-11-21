import express from 'express';
import multer from 'multer';
import { joinPaths } from '../utils.js';

import fs from 'fs';
import { uploadFiles, downloadFile, listFiles, deleteFile, createFolder, deleteFolder } from '../controllers/fileController.js';
import { getUploadsDirectory } from '../utils.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = req.query.folderPath || ''; // Get folderPath from query parameters
  
      const uploadPath = folderPath
        ? joinPaths(getUploadsDirectory(), folderPath)
        : getUploadsDirectory();
  
      // Ensure the directory exists
      fs.mkdirSync(uploadPath, { recursive: true });
  
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  

const upload = multer({ storage });

// Route to upload multiple files
router.post('/upload', upload.any(), uploadFiles);

// Route to download a file
router.get('/download/:filename', downloadFile);

// Route to list files
router.get('/list', listFiles);

// Route to delete a file
router.delete('/delete/*', deleteFile);

// Route to create a folder
router.post('/create-folder', createFolder);

// Route to delete a folder
router.delete('/delete-folder', deleteFolder);


export default router;

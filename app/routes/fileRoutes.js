// app/routes/fileRoutes.js
import express from 'express';
import { uploadFile, downloadFile, listFiles } from '../controllers/fileController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('uploads')); // Upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

const upload = multer({ storage });

// Route to upload a file
router.post('/upload', upload.single('file'), uploadFile);

// Route to download a file
router.get('/download/:filename', downloadFile);

router.get('/list', listFiles);

export default router;

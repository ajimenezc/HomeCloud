import express from 'express';
import fileRoutes from './fileRoutes.js';
import clipboardRoutes from './clipboardRoutes.js';

const router = express.Router();

// File upload and download routes
router.use('/files', fileRoutes);

// Clipboard routes
router.use('/clipboard', clipboardRoutes);

export default router;

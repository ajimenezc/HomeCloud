import express from 'express';
import { getHome } from '../controllers/home.js';
import fileRoutes from './fileRoutes.js';
import clipboardRoutes from './clipboardRoutes.js';

const router = express.Router();

// Home route
router.get('/', getHome);

// File upload and download routes
router.use('/files', fileRoutes);

// Clipboard routes
router.use('/clipboard', clipboardRoutes);

export default router;

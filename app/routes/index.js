// app/routes/index.js
import express from 'express';
import { getHome } from '../controllers/home.js';
import fileRoutes from './fileRoutes.js';

const router = express.Router();

// Home route
router.get('/', getHome);

// File upload and download routes
router.use('/files', fileRoutes);

export default router;

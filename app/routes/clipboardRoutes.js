import express from 'express';
import { getClipboardContent, setClipboardContent } from '../controllers/clipboardController.js';

const router = express.Router();

// Apply express.json() only to routes requiring JSON parsing
router.post('/set', express.json(), setClipboardContent);
router.get('/get', getClipboardContent);

export default router;

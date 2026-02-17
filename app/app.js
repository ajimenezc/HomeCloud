// app/app.js
import express from 'express';
import routes from './routes/index.js';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { getUploadsDirectory } from './utils.js';

// Compatible with both ESM and CJS (when bundled by esbuild)
const currentDir = typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(new URL(import.meta.url).pathname);
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/files/create-folder', express.json());
app.use('/files/delete-folder', express.json());
app.use('/files/delete/:filename', express.json());

// API routes
app.use('/', routes);

// Serve uploaded files
app.use('/uploads', express.static(getUploadsDirectory()));

// Serve React frontend build
// Development: currentDir is app/, so ../frontend/build
// Bundled .app: currentDir is Resources/, so ./frontend/build
const devPath = path.join(currentDir, '..', 'frontend', 'build');
const bundledPath = path.join(currentDir, 'frontend', 'build');
const frontendBuildPath = fs.existsSync(bundledPath) ? bundledPath : devPath;
app.use(express.static(frontendBuildPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

export default app;

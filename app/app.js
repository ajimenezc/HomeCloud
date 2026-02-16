// app/app.js
import express from 'express';
import routes from './routes/index.js';
import path from 'path';
import cors from 'cors';
import { getUploadsDirectory } from './utils.js';
console.log('UPLOAD_PATH:', getUploadsDirectory());
const app = express();

app.use(cors({
    origin: '*', // Only allow requests from the React frontend
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware (if any) can be added here
// app.use(express.json());
app.use('/files/create-folder', express.json());
app.use('/files/delete-folder', express.json());
app.use('/files/delete/:filename', express.json());

// Set up routes
app.use('/', routes);

app.use('/uploads', express.static(getUploadsDirectory()));

// app.options('/files/upload', cors());

export default app;

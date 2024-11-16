// app/app.js
import express from 'express';
import routes from './routes/index.js';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Only allow requests from the React frontend
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware (if any) can be added here
app.use(express.json());

// Set up routes
app.use('/', routes);

app.use('/uploads', express.static(path.resolve('uploads')));

app.options('/files/upload', cors());

export default app;

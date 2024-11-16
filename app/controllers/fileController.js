// app/controllers/fileController.js
import path from 'path';
import fs from 'fs';

// Handle file upload
export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({
        message: 'File uploaded successfully.',
        filename: req.file.filename
    });
};

// Handle file download
export const downloadFile = (req, res) => {
    const { filename } = req.params;
    const filePath = path.resolve('uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found.');
    }

    res.download(filePath, filename, (err) => {
        if (err) {
            res.status(500).send('Error downloading the file.');
        }
    });
};

export const listFiles = (req, res) => {
    const uploadsDir = path.resolve('uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files from the server.');
        }
        res.status(200).json(files);
    });
}

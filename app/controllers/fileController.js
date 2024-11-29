// app/controllers/fileController.js
import fs from 'fs';
import { getFilePath, getUploadsDirectory } from '../utils.js';
import { joinPaths, sanitizePath } from '../utils.js';
import path from 'path';



// Handle file upload
export const uploadFiles = (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
  
    const fileNames = req.files.map((file) => file.filename);
    res.status(200).json({
      message: `${fileNames.length} files uploaded successfully.`,
      files: fileNames,
    });
  };
  

export const downloadFile = (req, res) => {
    const relativePath = req.params[0];
    const sanitizedPath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(getUploadsDirectory(), sanitizedPath);

    // Verify that the file is within the uploads directory
    if (!filePath.startsWith(getUploadsDirectory())) {
        return res.status(400).send('Invalid file path');
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return res.status(404).send('File not found.');
    }

    // Attempt to send the file
    res.download(filePath, (err) => {
        if (err) {
            console.error(`Error downloading file: ${err.message}`);
            res.status(500).send('Error downloading the file.');
        }
    });
};


export const listFiles = (req, res) => {
    const uploadsDir = getUploadsDirectory(); // Use your utility function
    const getDirectoryTree = (dirPath) => {
        const items = fs.readdirSync(dirPath);
        return items.map((item) => {
            const fullPath = joinPaths(dirPath, item);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                return {
                    name: item,
                    type: 'directory',
                    children: getDirectoryTree(fullPath)
                };
            } else {
                return {
                    name: item,
                    type: 'file'
                };
            }
        });
    };

    try {
        const tree = getDirectoryTree(uploadsDir);
        res.status(200).json(tree);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading files from the server.' });
    }
};

export const deleteFile = (req, res) => {
    const filepath = req.params[0] || req.params.filepath; // Adjust based on your route
    const sanitizedFilepath = sanitizePath(filepath);
    const filePath = getFilePath(sanitizedFilepath);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting the file.' });
            }
            res.status(200).json({ message: 'File deleted successfully.' });
        });
    } else {
        res.status(404).json({ error: 'File not found.' });
    }
};

// Create a new folder
export const createFolder = (req, res) => {
    console.log(req.body)
    const { folderPath } = req.body; // Relative path from the uploads directory
    const newFolderPath = joinPaths(getUploadsDirectory(), folderPath);

    if (fs.existsSync(newFolderPath)) {
        return res.status(400).json({ error: 'Folder already exists.' });
    }

    fs.mkdir(newFolderPath, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error creating folder.' });
        }
        res.status(200).json({ message: 'Folder created successfully.' });
    });
};

// Delete a folder
export const deleteFolder = (req, res) => {
    const { folderPath } = req.body; // Relative path from the uploads directory
    const folderToDelete = joinPaths(getUploadsDirectory(), folderPath);

    if (!fs.existsSync(folderToDelete)) {
        return res.status(404).json({ error: 'Folder not found.' });
    }

    fs.rmdir(folderToDelete, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error deleting folder.' });
        }
        res.status(200).json({ message: 'Folder deleted successfully.' });
    });
};


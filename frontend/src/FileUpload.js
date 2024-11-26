// FileUpload.js
import React, { useState, useEffect } from 'react';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileTree from './FileTree'; 
import { joinPaths } from './utils.js';
import './styles.css';

const FileUpload = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fileTree, setFileTree] = useState([]);
    const [selectedFolderPath, setSelectedFolderPath] = useState(''); // For highlighting

    // Theme state
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    // Persist and apply theme on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem('isDarkTheme');
        if (savedTheme !== null) {
            setIsDarkTheme(JSON.parse(savedTheme));
        }
    }, []);

    // Apply theme class to body
    useEffect(() => {
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkTheme]);

    // Persist theme preference
    useEffect(() => {
        localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme));
    }, [isDarkTheme]);

    const toggleTheme = () => {
        setIsDarkTheme(prevTheme => !prevTheme);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://192.168.1.99:3001/files/list');
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const result = await response.json();
            setFileTree(result);
        } catch (err) {
            console.error(err);
            setError('Error fetching file list');
        }
    };

    // Modified handleCreateFolder to accept parentFolderPath and newFolderName
    const handleCreateFolder = async (parentFolderPath, newFolderName, setFolderMessage, setFolderError) => {
        if (!newFolderName.trim()) {
            setFolderError('Folder name cannot be empty.');
            setFolderMessage('');
            return;
        }

        try {
            const response = await fetch('http://192.168.1.99:3001/files/create-folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folderPath: joinPaths(parentFolderPath, newFolderName),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create folder');
            }
            setFolderMessage('Folder created successfully.');
            setFolderError('');
            fetchFiles();
        } catch (err) {
            setFolderError(err.message);
            setFolderMessage('');
        }
    };

    // Reusable upload function
    const uploadFilesToFolder = async (folderPath, files, setFolderMessage, setFolderError, setFolderProgress) => {
        if (!files.length) {
            setFolderError('Please select at least one file to upload.');
            setFolderMessage('');
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }

        const xhr = new XMLHttpRequest();

        const uploadUrl = `http://192.168.1.99:3001/files/upload?folderPath=${encodeURIComponent(
            folderPath
        )}`;

        xhr.open('POST', uploadUrl, true);

        // Track upload progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setFolderProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setFolderMessage(`${response.files.length} files uploaded successfully.`);
                setFolderError('');
                setFolderProgress(0);
                fetchFiles();
            } else {
                setFolderError('Failed to upload files');
                setFolderProgress(0);
            }
        };

        xhr.onerror = () => {
            setFolderError('An error occurred during file upload.');
            setFolderProgress(0);
        };

        xhr.send(formData);
    };

    const handleFileDelete = async (filePath) => {
        try {
            const response = await fetch(`http://192.168.1.99:3001/files/delete/${filePath}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }

            const result = await response.json();
            setMessage(result.message);
            setError('');
            fetchFiles();
        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    const handleDeleteFolder = async (folderPath) => {
        try {
            const response = await fetch('http://192.168.1.99:3001/files/delete-folder', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderPath }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete folder');
            }
            const result = await response.json();
            setMessage(result.message);
            setError('');
            fetchFiles();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFolderSelect = (folderPath) => {
        setSelectedFolderPath(folderPath);
    };

    return (
        <div className={`container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <header className="headerContainer">
                <h1 className="header">File Manager</h1>
                <button className="themeToggleButton" onClick={toggleTheme} aria-label="Toggle Theme">
                    <FontAwesomeIcon icon={isDarkTheme ? faSun : faMoon} />
                </button>
            </header>

            {/* Progress bar */}
            <div className="progressBarContainer">
                {/* Global upload progress can be removed or kept if needed */}
            </div>

            {message && <p className="successMessage">{message}</p>}
            {error && <p className="errorMessage">{error}</p>}

            <h2 className="header">Files</h2>
            {fileTree.length > 0 ? (
                <FileTree
                    tree={fileTree}
                    handleFileDelete={handleFileDelete}
                    handleDeleteFolder={handleDeleteFolder}
                    onFolderSelect={handleFolderSelect}
                    selectedFolderPath={selectedFolderPath}
                    uploadFilesToFolder={uploadFilesToFolder} // Pass the upload function
                    handleCreateFolder={handleCreateFolder} // Pass the create folder function
                />
            ) : (
                <p>No files uploaded yet.</p>
            )}
        </div>
    );
};

export default FileUpload;

import React, { useState, useEffect } from 'react';
import { faFolderPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileTree from './FileTree'; 
import { joinPaths } from './utils.js';
import './styles.css'


const FileUpload = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fileTree, setFileTree] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [currentFolderPath, setCurrentFolderPath] = useState(''); // Initialize to root
    const [selectedFolderPath, setSelectedFolderPath] = useState(''); // For highlighting

    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch files when the component mounts
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://192.168.1.37:3001/files/list');
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

    const handleCreateFolder = async (event) => {
        event.preventDefault();
        console.log(joinPaths(currentFolderPath, newFolderName))
        try {
            const response = await fetch('http://192.168.1.37:3001/files/create-folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folderPath: joinPaths(currentFolderPath, newFolderName),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create folder');
            }
            setMessage('Folder created successfully.');
            setNewFolderName('');
            fetchFiles();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
        const fileInput = event.target.querySelector('input[type="file"]');
      
        if (!fileInput.files.length) {
          setError('Please select at least one file to upload.');
          setMessage('');
          return;
        }
      
        const formData = new FormData();
        for (const file of fileInput.files) {
          formData.append('files', file);
        }
      
        const xhr = new XMLHttpRequest();
      
        // Include folderPath in the query parameters
        const uploadUrl = `http://192.168.1.37:3001/files/upload?folderPath=${encodeURIComponent(
          currentFolderPath
        )}`;
      
        xhr.open('POST', uploadUrl, true);

        // Track upload progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setMessage(`${response.files.length} files uploaded successfully.`);
                setError('');
                setUploadProgress(0);
                fetchFiles();
            } else {
                setError('Failed to upload files');
                setUploadProgress(0);
            }
        };

        xhr.onerror = () => {
            setError('An error occurred during file upload.');
            setUploadProgress(0);
        };

        xhr.send(formData);
    };

    const handleFileDelete = async (filePath) => {
        try {
            const response = await fetch(`http://192.168.1.37:3001/files/delete/${filePath}`, {
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
            const response = await fetch('http://192.168.1.37:3001/files/delete-folder', {
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
        setCurrentFolderPath(folderPath);
        setSelectedFolderPath(folderPath);
      };

    return (
        <div className="container">
            <h1 className="header">File Manager</h1>
            <div className="currentFolderPath">
                <strong>Current Folder:</strong> {currentFolderPath || 'Root'}
            </div>
            <form onSubmit={handleCreateFolder} className="form">
                <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="folderInput"
                />
                <button type="submit" className="button">
                    <FontAwesomeIcon icon={faFolderPlus} />
                </button>
            </form>

            <form onSubmit={handleFileUpload} className="form">
                <input type="file" name="files" multiple className="fileInput" />
                <button type="submit" className="button">
                    <FontAwesomeIcon icon={faUpload} />
                </button>
            </form>

            {/* Progress bar */}
            <div className="progressBarContainer">
                {uploadProgress > 0 && (
                    <div className="progressBar">
                        <div
                            className="progressFill"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {message && <p className="successMessage">{message}</p>}
            {error && <p className="errorMessage">{error}</p>}

            <h2 className="header">Files</h2>
            {fileTree.length > 0 ? (
                <FileTree
                    tree={fileTree}
                    currentPath=""
                    handleFileDelete={handleFileDelete}
                    handleDeleteFolder={handleDeleteFolder}
                    onFolderSelect={handleFolderSelect}
                    selectedFolderPath={selectedFolderPath}
                />
            ) : (
                <p>No files uploaded yet.</p>
            )}
        </div>
    );
};

export default FileUpload;

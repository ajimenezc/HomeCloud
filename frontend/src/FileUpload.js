import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css'; // Import your CSS file

const FileUpload = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  // Fetch the list of files in the uploads folder
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://192.168.1.37:3001/files/list');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const result = await response.json();
      setFiles(result);
    } catch (err) {
      console.error(err);
      setError('Error fetching file list');
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    event.preventDefault();
    const fileInput = event.target.file;

    if (!fileInput.files.length) {
      setError('Please select a file to upload.');
      setMessage('');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
      const response = await fetch('http://192.168.1.37:3001/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      setMessage(`File uploaded successfully: ${result.filename}`);
      setError('');
      fetchFiles(); // Refresh file list after upload
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

   // Handle file deletion
   const handleFileDelete = async (filename) => {
    try {
      const response = await fetch(`http://192.168.1.37:3001/files/delete/${filename}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const result = await response.json();
      setMessage(result.message);
      setError('');
      fetchFiles(); // Refresh file list after deletion
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  // Fetch files when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch files when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h1 className="header">Upload a File</h1>
      <form onSubmit={handleFileUpload} className="form">
        <input type="file" name="file" className="fileInput" />
        <button type="submit" className="button">
          <FontAwesomeIcon icon={faUpload} /> {/* Upload Icon */}
        </button>
      </form>
      {message && <p className="successMessage">{message}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <h2 className="header">Uploaded Files</h2>
      {files.length > 0 ? (
  <ul className="fileList">
    {files.map((file) => (
      <li key={file} className="fileItem">
        <span>{file}</span>
        <a
          href={`http://192.168.1.37:3001/files/download/${file}`}
          className="iconButton"
        >
          <FontAwesomeIcon icon={faDownload} />
        </a>
        <button
          className="iconButton deleteButton"
          onClick={() => handleFileDelete(file)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </li>
    ))}
  </ul>
) : (
  <p>No files uploaded yet.</p>
)}
    </div>
  );
};
export default FileUpload;

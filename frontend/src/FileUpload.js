import React, { useState, useEffect } from 'react';

const FileUpload = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  // Fetch the list of files in the uploads folder
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:3001/files/list');
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
      const response = await fetch('http://localhost:3001/files/upload', {
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

  // Fetch files when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Upload a File</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Uploaded Files</h2>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file}>
              <span>{file}</span>
              <a href={`http://localhost:3001/files/download/${file}`} style={{ marginLeft: '10px' }}>Download</a>
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

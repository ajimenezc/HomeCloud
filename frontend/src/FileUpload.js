import React, { useState } from 'react';

const FileUpload = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Upload a File</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;

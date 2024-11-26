// FileItem.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faDownload, faTrash, faEye, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

// Ensure that the modal is attached to your app element (for accessibility)
Modal.setAppElement('#root');

const FileItem = ({ item, itemPath, handleFileDelete }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Function to handle file deletion with confirmation
  const confirmDeleteFile = (e) => {
    e.stopPropagation();
    const confirm = window.confirm(
      `Are you sure you want to delete the file "${item.name}"? This action cannot be undone.`
    );
    if (confirm) {
      handleFileDelete(itemPath);
    }
  };

  // Function to open preview modal
  const openPreview = (e) => {
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  // Function to close preview modal
  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  // Function to open details modal
  const openDetails = (e) => {
    e.stopPropagation();
    setIsDetailsOpen(true);
  };

  // Function to close details modal
  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  // Determine if the file is previewable
  const isPreviewable = item.name.match(/\.(jpeg|jpg|png|gif|pdf|txt|docx?)$/i);

  // Construct the file URL
  const fileUrl = `http://192.168.1.99:3001/uploads/${itemPath}`;

  return (
    <li key={itemPath} className="fileItem">
      <div className="textBlock">
        <div className="previewBlock">
          {item.name.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img
              src={fileUrl}
              alt={item.name}
              className="filePreview"
            />
          ) : (
            <FontAwesomeIcon icon={faFile} />
          )}
        </div>
        <span className="fileName">
          {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
        </span>
        <div className="actionButtons">
          {isPreviewable && (
            <button className="iconButton" onClick={openPreview} title="Preview">
              <FontAwesomeIcon icon={faEye} />
            </button>
          )}
          <button className="iconButton" onClick={openDetails} title="Details">
            <FontAwesomeIcon icon={faInfoCircle} />
          </button>
          <a
            href={`http://192.168.1.99:3001/files/download/${itemPath}`}
            className="iconButton"
            title="Download"
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>
          <button
            className="iconButton deleteButton"
            onClick={confirmDeleteFile} // Use the confirmation handler
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onRequestClose={closePreview}
          contentLabel="File Preview"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modalHeader">
            <h2>Preview: {item.name}</h2>
            <button onClick={closePreview} className="closeButton">
              &times;
            </button>
          </div>
          <div className="modalContent">
            {item.name.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <img src={fileUrl} alt={item.name} className="modalImage" />
            ) : item.name.match(/\.pdf$/i) ? (
              <iframe src={fileUrl} title={item.name} className="modalIframe"></iframe>
            ) : (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            )}
          </div>
        </Modal>
      )}

      {/* Details Modal */}
      {isDetailsOpen && (
        <Modal
          isOpen={isDetailsOpen}
          onRequestClose={closeDetails}
          contentLabel="File Details"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modalHeader">
            <h2>Details: {item.name}</h2>
            <button onClick={closeDetails} className="closeButton">
              &times;
            </button>
          </div>
          <div className="modalContent">
            <ul>
              <li><strong>Name:</strong> {item.name}</li>
              <li><strong>Size:</strong> {formatFileSize(item.size)}</li>
              <li><strong>Type:</strong> {item.type || 'N/A'}</li>
              <li><strong>Last Modified:</strong> {new Date(item.lastModified).toLocaleString()}</li>
              {/* Add more details as needed */}
            </ul>
          </div>
        </Modal>
      )}
    </li>
  );
};

// Helper function to format file size
const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
  return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FileItem;

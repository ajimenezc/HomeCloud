// FileItem.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

const FileItem = ({ item, itemPath, handleFileDelete }) => {
  // New function to handle file deletion with confirmation
  const confirmDeleteFile = (e) => {
    e.stopPropagation();
    const confirm = window.confirm(
      `Are you sure you want to delete the file "${item.name}"? This action cannot be undone.`
    );
    if (confirm) {
      handleFileDelete(itemPath);
    }
  };

  return (
    <li key={itemPath} className="fileItem">
      <div className="previewBlock">
        {item.name.match(/\.(jpeg|jpg|png|gif)$/i) ? (
          <img
            src={`http://mac-mini-de-andres.local:3001/uploads/${itemPath}`}
            alt={item.name}
            className="filePreview"
          />
        ) : (
          <FontAwesomeIcon icon={faFile} />
        )}
      </div>
      <div className="textBlock">
        <span className="fileName">{item.name}</span>
        <div className="actionButtons">
          <a
            href={`http://mac-mini-de-andres.local:3001/files/download/${itemPath}`}
            className="iconButton"
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>
          <button
            className="iconButton deleteButton"
            onClick={confirmDeleteFile} // Use the confirmation handler
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default FileItem;

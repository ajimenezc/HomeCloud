// FileItem.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

const FileItem = ({ item, itemPath, handleFileDelete }) => {
  return (
    <li key={itemPath} className="fileItem">
      <div className="previewBlock">
        {item.name.match(/\.(jpeg|jpg|png|gif)$/i) ? (
          <img
            src={`http://192.168.1.37:3001/uploads/${itemPath}`}
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
            href={`http://192.168.1.37:3001/files/download/${itemPath}`}
            className="iconButton"
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>
          <button
            className="iconButton deleteButton"
            onClick={() => handleFileDelete(itemPath)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default FileItem;

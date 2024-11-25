// Folder.js
import React, { useState, useRef } from 'react';
import FileItem from './FileItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFolderOpen,
  faTrash,
  faFileText,
  faChevronRight,
  faChevronDown,
  faUpload,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { joinPaths } from './utils.js';

const Folder = ({
  item,
  currentPath,
  handleFileDelete,
  handleDeleteFolder,
  onFolderSelect,
  selectedFolderPath,
  uploadFilesToFolder, // Receive the upload function
  handleCreateFolder, // Receive the create folder function
  isRoot = false,
}) => {
  const [collapsed, setCollapsed] = useState(isRoot ? false : true);
  const itemPath = isRoot ? '' : joinPaths(currentPath, item.name);

  const toggleCollapse = (e) => {
    e.stopPropagation();
    setCollapsed(!collapsed);
  };

  const handleFolderClick = () => {
    onFolderSelect(itemPath);
  };

  const isSelected = selectedFolderPath === itemPath;

  // States for upload feedback
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // States for creating a new folder
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [createFolderMessage, setCreateFolderMessage] = useState('');
  const [createFolderError, setCreateFolderError] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const files = fileInputRef.current.files;
    uploadFilesToFolder(itemPath, files, setUploadMessage, setUploadError, setUploadProgress);
    // Clear the file input after submission
    fileInputRef.current.value = '';
  };

  const handleCreateFolderClick = () => {
    setIsCreatingFolder(true);
  };

  const handleCreateFolderSubmit = (e) => {
    e.preventDefault();
    handleCreateFolder(itemPath, newFolderName, setCreateFolderMessage, setCreateFolderError);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleCancelCreateFolder = () => {
    setIsCreatingFolder(false);
    setNewFolderName('');
    setCreateFolderMessage('');
    setCreateFolderError('');
  };

  return (
    <li key={itemPath} className={`fileItem ${isRoot ? 'rootFolder' : ''}`}>
      <div
        className={`folderBlock ${isSelected ? 'selectedFolder' : ''}`}
        onClick={handleFolderClick}
      >
        {item.children && item.children.length > 0 && (
          <button onClick={toggleCollapse} className="collapseButton">
            <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronDown} />
          </button>
        )}
        <FontAwesomeIcon
          icon={collapsed ? faFolder : faFolderOpen}
          className="folderIcon"
        />
        <span className="folderName">{isRoot ? 'Root' : item.name}</span>
        {!isRoot && (
          <div className="actionButtons" onClick={(e) => e.stopPropagation()}>
            <button
              className="iconButton deleteButton"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(itemPath);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      </div>
      {!collapsed && (
        <div>
          {/* Upload and Create Folder Controls */}
          <div className="uploadControls">
            {/* Hidden file input */}
            <input
              type="file"
              name="files"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                // Optionally handle file selection changes
              }}
            />

            {/* Select Files Button */}
            <button type="button" className="button" onClick={handleUploadClick}>
              <FontAwesomeIcon icon={faFileText} /> Select Files
            </button>

            {/* Upload Files Button */}
            <button
              type="button"
              className="button"
              onClick={handleUploadSubmit}
              disabled={uploadProgress > 0}
            >
              <FontAwesomeIcon icon={faUpload} /> Upload Files
            </button>

            {/* Create New Folder Button */}
            <button type="button" className="button" onClick={handleCreateFolderClick}>
              <FontAwesomeIcon icon={faPlus} /> New Folder
            </button>
          </div>

          {/* Create Folder Form */}
          {isCreatingFolder && (
            <form onSubmit={handleCreateFolderSubmit} className="form createFolderForm">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder name"
                className="folderInput"
                required
              />
              <button type="submit" className="button">
                Create
              </button>
              <button type="button" className="button cancelButton" onClick={handleCancelCreateFolder}>
                Cancel
              </button>
            </form>
          )}

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

          {/* Upload Feedback */}
          {uploadMessage && <p className="successMessage">{uploadMessage}</p>}
          {uploadError && <p className="errorMessage">{uploadError}</p>}

          {/* Create Folder Feedback */}
          {createFolderMessage && <p className="successMessage">{createFolderMessage}</p>}
          {createFolderError && <p className="errorMessage">{createFolderError}</p>}

          <ul className="fileList">
            {item.children.map((childItem) => {
              const childItemPath = joinPaths(itemPath, childItem.name);
              if (childItem.name.startsWith('.')) {
                return null; // Skip hidden files and folders
              } else if (childItem.type === 'directory') {
                return (
                  <Folder
                    key={childItemPath}
                    item={childItem}
                    currentPath={itemPath}
                    handleFileDelete={handleFileDelete}
                    handleDeleteFolder={handleDeleteFolder}
                    onFolderSelect={onFolderSelect}
                    selectedFolderPath={selectedFolderPath}
                    uploadFilesToFolder={uploadFilesToFolder} // Pass it down
                    handleCreateFolder={handleCreateFolder} // Pass it down
                  />
                );
              } else {
                return (
                  <FileItem
                    key={childItemPath}
                    item={childItem}
                    itemPath={childItemPath}
                    handleFileDelete={handleFileDelete}
                  />
                );
              }
            })}
          </ul>
        </div>
      )}
    </li>
  );
};

export default Folder;

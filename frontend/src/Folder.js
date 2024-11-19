// Folder.js
import React, { useState } from 'react';
import FileTree from './FileTree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFolderOpen,
  faTrash,
  faChevronRight,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { joinPaths } from './utils.js';

const Folder = ({
  item,
  currentPath,
  handleFileDelete,
  handleDeleteFolder,
  onFolderSelect,
  selectedFolderPath,
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const itemPath = joinPaths(currentPath, item.name);

  const toggleCollapse = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the parent
    setCollapsed(!collapsed);
  };

  const handleFolderClick = () => {
    onFolderSelect(itemPath);
    // Remove the following line if you don't want to auto-expand when a folder is selected
    // setCollapsed(false);
  };

  const isSelected = selectedFolderPath === itemPath;

  return (
    <li key={itemPath} className="fileItem">
      <div
        className={`folderBlock ${isSelected ? 'selectedFolder' : ''}`}
        onClick={handleFolderClick}
      >
        <button onClick={toggleCollapse} className="collapseButton">
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronDown} />
        </button>
        <FontAwesomeIcon icon={collapsed ? faFolder : faFolderOpen} />
        <span className="folderName">{item.name}</span>
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
      </div>
      {!collapsed && (
        <FileTree
          tree={item.children}
          currentPath={itemPath}
          handleFileDelete={handleFileDelete}
          handleDeleteFolder={handleDeleteFolder}
          onFolderSelect={onFolderSelect}
          selectedFolderPath={selectedFolderPath}
        />
      )}
    </li>
  );
};

export default Folder;

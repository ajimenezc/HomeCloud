// Folder.js
import React, { useState } from 'react';
import FileItem from './FileItem';
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
        <span className="folderName">{item.name}</span>
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
      )}
    </li>
  );
};

export default Folder;

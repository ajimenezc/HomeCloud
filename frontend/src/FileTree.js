// FileTree.js
// FileTree.js
import React from 'react';
import Folder from './Folder';
import FileItem from './FileItem'; // Create a separate component for files
import { joinPaths } from './utils.js';

const FileTree = ({
  tree,
  currentPath = '',
  handleFileDelete,
  handleDeleteFolder,
  onFolderSelect,
  selectedFolderPath,
}) => {
  return (
    <ul className="fileList">
      {tree.map((item) => {
        const itemPath = joinPaths(currentPath, item.name);
        if (item.name.startsWith('.'))
        {
            // hidden files, skip
        }
        else if (item.type === 'directory') {
          return (
            <Folder
              key={itemPath}
              item={item}
              currentPath={currentPath}
              handleFileDelete={handleFileDelete}
              handleDeleteFolder={handleDeleteFolder}
              onFolderSelect={onFolderSelect}
              selectedFolderPath={selectedFolderPath}
            />
          );
        } else {
          return (
            <FileItem
              key={itemPath}
              item={item}
              itemPath={itemPath}
              handleFileDelete={handleFileDelete}
            />
          );
        }
      })}
    </ul>
  );
};

export default FileTree;

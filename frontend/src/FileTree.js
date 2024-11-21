// FileTree.js
import React from 'react';
import Folder from './Folder';
import { joinPaths } from './utils.js';

const FileTree = ({
  tree,
  handleFileDelete,
  handleDeleteFolder,
  onFolderSelect,
  selectedFolderPath,
}) => {
  const rootFolder = {
    name: 'Root',
    type: 'directory',
    children: tree,
  };

  return (
    <ul className="fileList">
      <Folder
        item={rootFolder}
        currentPath=""
        handleFileDelete={handleFileDelete}
        handleDeleteFolder={handleDeleteFolder}
        onFolderSelect={onFolderSelect}
        selectedFolderPath={selectedFolderPath}
        isRoot={true}
      />
    </ul>
  );
};

export default FileTree;

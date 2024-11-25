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
  uploadFilesToFolder, // Receive the upload function
  handleCreateFolder, // Receive the create folder function
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
        uploadFilesToFolder={uploadFilesToFolder} // Pass it down
        handleCreateFolder={handleCreateFolder} // Pass it down
        isRoot={true}
      />
    </ul>
  );
};

export default FileTree;

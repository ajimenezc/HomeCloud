import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { joinPaths } from './utils.js';

// Utility to join paths in a browser-friendly way

const FileTree = ({ tree, currentPath = '', handleFileDelete, handleDeleteFolder }) => {
    return (
        <ul className="fileList">
            {tree.map((item) => {
                const itemPath = joinPaths(currentPath, item.name); // Use joinPaths here
                if (item.type === 'directory') {
                    return (
                        <li key={itemPath} className="fileItem">
                            <div className="folderBlock">
                                <FontAwesomeIcon icon={faFolder} />
                                <span className="folderName">{item.name}</span>
                                <div className="actionButtons">
                                    <button
                                        className="iconButton deleteButton"
                                        onClick={() => handleDeleteFolder(itemPath)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                            <FileTree
                                tree={item.children}
                                currentPath={itemPath} // Pass the updated path
                                handleFileDelete={handleFileDelete}
                                handleDeleteFolder={handleDeleteFolder}
                            />
                        </li>
                    );
                } else {
                    return (
                        <li key={itemPath} className="fileItem">
                            <div className="previewBlock">
                                {item.name.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                    <img
                                        src={`http://192.168.1.37:3001/uploads/${itemPath}`} // Use itemPath
                                        alt={item.name}
                                        className="filePreview"
                                    />
                                ) : (
                                    <span className="fileIcon">📄</span>
                                )}
                            </div>
                            <div className="textBlock">
                                <span className="fileName">{item.name}</span>
                                <div className="actionButtons">
                                    <a
                                        href={`http://192.168.1.37:3001/files/download/${itemPath}`} // Use itemPath
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
                }
            })}
        </ul>
    );
};

export default FileTree;

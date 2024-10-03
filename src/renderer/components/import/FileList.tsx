import React, { useState } from 'react';
import { ImportFile } from '../../../types';
import FileListMoreButton from './FileListMoreButton';
import FolderMoreButton from './FolderMoreButton';
import { FaFolder, FaFolderOpen, FaRegFile } from 'react-icons/fa';

interface FileListProps {
  disabled: boolean;
  files: ImportFile[]; // Adjusted type to include directory
  onDelete: (file: ImportFile) => void;
  onDeleteFolder: (folder: string) => void;
  onPreParseFolder: (folder: string) => void;
  onAssistFolder: (folder: string) => void;
  onExportFolder: (folder: string) => void;
}

const groupFilesByFolder = (files: ImportFile[]) => {
  const groupedFiles: Record<string, ImportFile[]> = {};

  files.forEach((file) => {
    if (file.directory) {
      const dirName = file.directory.split('/').pop() || 'Unknown'; // Ensure directory exists and provide a fallback
      if (!groupedFiles[dirName]) {
        groupedFiles[dirName] = [];
      }
      groupedFiles[dirName].push(file);
    }
  });

  return groupedFiles;
};

const FileList: React.FC<FileListProps> = ({
  disabled,
  files,
  onDelete,
  onDeleteFolder,
  onPreParseFolder,
  onAssistFolder,
  onExportFolder,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});

  // Toggle the expand/collapse state for a folder
  const toggleFolder = (folder: string) => {
    setExpandedFolders((prevState) => ({
      ...prevState,
      [folder]: !prevState[folder], // Toggle the folder's expanded state
    }));
  };

  // Group the files by their parent directories
  const groupedFiles = groupFilesByFolder(files);

  return (
    <div id="file-list">
      {Object.entries(groupedFiles).map(([folder, folderFiles]) => (
        <div key={folder} className="folder-container mb-1">
          {/* Folder header */}
          <div
            className="flex justify-between items-center bg-gray-200 p-2 rounded-t cursor-pointer"
            onClick={() => toggleFolder(folder)} // Toggle folder on click
          >
            {expandedFolders[folder] ? (
              <FaFolderOpen className="text-base text-slate-500" />
            ) : (
              <FaFolder className="text-base text-slate-500" />
            )}
            <span className="folder-name font-bold text-base">{folder}</span>
            {/* FolderMoreButton aligned to the far right */}
            <FolderMoreButton
              disabled={disabled}
              folderName={folder}
              handleDelete={onDeleteFolder}
              handlePreParse={onPreParseFolder}
              handleAssist={onAssistFolder}
              handleExport={onExportFolder}
            />
          </div>

          {/* Conditionally render files in the folder if the folder is expanded */}
          {expandedFolders[folder] && (
            <ul id="files" className="border border-gray-200 rounded-b">
              {folderFiles.map((file) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded border-b"
                >
                  <FaRegFile className="text-base text-slate-500" />
                  <div className="flex items-center w-full">
                    <span className="text-base ml-2">{file.name}</span>
                  </div>
                  <FileListMoreButton
                    disabled={disabled}
                    file={file}
                    handleDelete={onDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;

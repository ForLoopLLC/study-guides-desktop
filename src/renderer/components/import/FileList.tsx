import React from 'react';
import { ImportFile } from '../../../types';
import FileListMoreButton from './FileListMoreButton';
import FolderMoreButton from './FolderMoreButton';

interface FileListProps {
  files: ImportFile[]; // Adjusted type to include directory
  onDelete: (file: ImportFile) => void;
  onPreParse: (file: ImportFile) => void;
  onDeleteFolder: (folder: string) => void;
  onPreParseFolder: (folder: string) => void;
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
  files,
  onDelete,
  onDeleteFolder,
  onPreParse,
  onPreParseFolder,
}) => {
  // Group the files by their parent directories
  const groupedFiles = groupFilesByFolder(files);

  return (
    <div id="file-list">
      {Object.entries(groupedFiles).map(([folder, folderFiles]) => (
        <div key={folder} className="folder-container mb-4">
          {/* Folder header */}
          <div className="flex justify-between items-center bg-gray-200 p-2 rounded-t">
            <span className="folder-name font-bold text-lg">{folder}</span>
            {/* FolderMoreButton aligned to the far right */}
            <FolderMoreButton
              folderName={folder}
              handleDelete={onDeleteFolder}
              handlePreParse={onPreParseFolder}
            />
          </div>

          {/* Files in the folder */}
          <ul id="files" className="border border-gray-200 rounded-b">
            {folderFiles.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded border-b"
              >
                <div className="flex items-center w-full">
                  <span className="text-lg ml-2">{file.name}</span>
                </div>
                <FileListMoreButton
                  file={file}
                  handleDelete={onDelete}
                  handlePreParse={onPreParse}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FileList;

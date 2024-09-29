import React from 'react';
import { ImportFile } from '../../../types';
import FileListMoreButton from './FileListMoreButton';

interface FileListProps {
  files: ImportFile[]; // Adjust the type as needed for your tag object
  onDelete: (file: ImportFile) => void;
  onPreParse: (file: ImportFile) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onDelete,
  onPreParse,
}) => {
  return (
    <ul id="files">
      {files.map((file) => (
        <li
          key={file.name}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded border-b"
        >
          <div
            className="flex items-center w-full"
          >
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
  );
};

export default FileList;

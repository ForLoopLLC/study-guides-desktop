import { useEffect, useRef, useState } from 'react';
import { useFileUpload, useManageFiles } from '../../hooks';
import { ParserOperationMode, ParserType } from '../../../enums';
import FileList from './FileList';
import { ImportFile, Feedback } from '../../../types';
import { FaFileImport, FaSpinner } from 'react-icons/fa';

interface FileUploadProps {
  parserType: ParserType;
}

const FileUpload: React.FC<FileUploadProps> = ({ parserType }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the file input element
  const {
    feedback: uploadFeedback,
    isLoading,
    handleFileChange,
  } = useFileUpload(parserType);
  const {
    feedback: fileManagementFeedback,
    files,
    listFiles,
    deleteFile,
    deleteFolder,
    preParseFile,
    preParseFolder,
    isProcessingList,
    isProcessingDelete,
    isProcessingPreParse,
    isProcessingDeleteFolder,
    isProcessingPreParseFolder,
  } = useManageFiles(parserType);

  const [combinedFeedback, setCombinedFeedback] = useState<Feedback | null>(
    null,
  );

  useEffect(() => {
    const newerFeedback = (): Feedback | null => {
      if (!uploadFeedback && !fileManagementFeedback) return null;
      if (!uploadFeedback) return fileManagementFeedback;
      if (!fileManagementFeedback) return uploadFeedback;

      // Compare the dateTime fields to determine which feedback is newer
      return new Date(uploadFeedback.dateTime) >
        new Date(fileManagementFeedback.dateTime)
        ? uploadFeedback
        : fileManagementFeedback;
    };

    const feedbackToUse = newerFeedback();
    if (feedbackToUse?.level === 'trace') {
      return;
    }

    if (feedbackToUse) {
      setCombinedFeedback(feedbackToUse);
    }
  }, [uploadFeedback, fileManagementFeedback]);

  useEffect(() => {
    listFiles();
  }, [uploadFeedback]);

  const handleDeleteFile = (file: ImportFile) => {
    deleteFile(file.path);
  };

  const handlePreParse = (file: ImportFile) => {
    preParseFile(file.path, parserType, ParserOperationMode.PreParse);
  };

  const handlePreParseFolder = (folderName: string) => {
    preParseFolder(folderName, parserType, ParserOperationMode.PreParse);
  };

  const handleDeleteFolder = (folderName: string) => {
    deleteFolder(folderName);
  };

  // New function to reset the input value
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input value to allow re-upload of the same file
    }
  };

  const handleFileChangeWithReset = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFileChange(e); // Call the original file change handler
    resetFileInput(); // Reset the input after handling the file
  };

  // Combine the isProcessing states
  const isAnyProcessing =
    isProcessingList ||
    isProcessingDelete ||
    isProcessingPreParse ||
    isProcessingDeleteFolder ||
    isProcessingPreParseFolder;

  return (
    <main className="p-6">
      <h2 className="text-xl font-bold mb-4">Select Your File</h2>
      <div className="flex items-center space-x-4 mb-6">
        {isLoading ? (
          <FaSpinner className="text-2xl text-gray-500 animate-spin" />
        ) : (
          <FaFileImport className="text-2xl text-gray-500" />
        )}
        <input
          ref={fileInputRef} // Attach the ref to the input
          type="file"
          onChange={handleFileChangeWithReset} // Use the new handler with reset
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      {/* Combined Feedback Section */}
      <section>
        {combinedFeedback && (
          <p
            className={`text-lg p-4 ${
              combinedFeedback.success
                ? 'text-black bg-green-300'
                : 'text-black bg-red-300'
            }`}
          >
            {combinedFeedback.message}
          </p>
        )}
      </section>

      <section className="mt-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold">Files</h3>
          {isAnyProcessing && (
            <FaSpinner className="text-lg text-gray-500 animate-spin" />
          )}
        </div>
        <FileList
          files={files}
          onDelete={handleDeleteFile}
          onPreParse={handlePreParse}
          onDeleteFolder={handleDeleteFolder}
          onPreParseFolder={handlePreParseFolder}
        />
      </section>
    </main>
  );
};

export default FileUpload;

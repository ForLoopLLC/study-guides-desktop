import { useEffect, useRef, useState, useMemo } from 'react';
import { useFileUpload, useManageFiles } from '../../hooks';
import { ParserType } from '../../../enums';
import FileList from './FileList';
import { ImportFile, Feedback } from '../../../types';
import { FaFileImport, FaSpinner, FaClipboard, FaListUl } from 'react-icons/fa';
import ProgressBar from '../ProgressBar';
import GlobalMoreButton from './GlobalMoreButton';
import Duration from './Duration';

interface FileManagerProps {
  parserType: ParserType;
}

const FileManager: React.FC<FileManagerProps> = ({ parserType }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [startAssistTime, setStartAssistTime] = useState<number | null>(null); // Store assist start time
  const [stopAssistTime, setStopAssistTime] = useState<number | null>(null); // Store assist stop time
  const [startExportTime, setStartExportTime] = useState<number | null>(null); // Store export start time
  const [stopExportTime, setStopExportTime] = useState<number | null>(null); // Store export stop time
  const [currentFolder, setCurrentFolder] = useState<string | null>(null); // Store the current folder being processed
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the file input element

  const {
    feedback: uploadFeedback,
    isLoading,
    handleFileChange,
  } = useFileUpload(parserType);
  const {
    feedback: fileManagementFeedback,
    assistProgress,
    exportProgress,
    files,
    listFiles,
    deleteFile,
    deleteFolder,
    preParseFolder,
    assistFolder,
    exportFolder,
    isProcessingList,
    isProcessingDelete,
    isProcessingDeleteFolder,
    isProcessingPreParseFolder,
    isProcessingAssistFolder,
    isProcessingExportFolder,
  } = useManageFiles(parserType);

  const [combinedFeedback, setCombinedFeedback] = useState<Feedback | null>(
    null,
  );

  const getGlobalFolderName = (parser: ParserType): string => {
    let folderName = '';
    switch (parser) {
      case ParserType.Colleges:
        folderName = 'colleges';
        break;
      case ParserType.Certifications:
        folderName = 'certifications';
        break;
      default:
        folderName = 'Unknown';
    }
    return folderName;
  };

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

  useEffect(() => {
    // If assist is complete, capture the stop time
    if (!isProcessingAssistFolder && startAssistTime) {
      setStopAssistTime(Date.now());
    }
  }, [isProcessingAssistFolder, startAssistTime]);

  useEffect(() => {
    // If assist is complete, capture the stop time
    if (!isProcessingExportFolder && startExportTime) {
      setStopExportTime(Date.now());
    }
  }, [isProcessingExportFolder, startExportTime]);

  // Combine the isProcessing states
  const isAnyProcessing = useMemo(
    () =>
      isProcessingList ||
      isProcessingDelete ||
      isProcessingDeleteFolder ||
      isProcessingPreParseFolder ||
      isProcessingExportFolder ||
      isProcessingAssistFolder,
    [
      isProcessingList,
      isProcessingDelete,
      isProcessingDeleteFolder,
      isProcessingPreParseFolder,
      isProcessingExportFolder,
      isProcessingAssistFolder,
    ],
  );

  const handleExportAll = (folderName: string) => {
    setCurrentFolder(folderName);
    console.log(`Export all in ${folderName}`);
  };

  const handleAssistAll = (folderName: string) => {
    setCurrentFolder(folderName);
    console.log(`Assist all in ${folderName}`);
  };

  const handleExportFolder = (folderName: string) => {
    if (isAnyProcessing) return;
    setStartExportTime(Date.now());
    setStopExportTime(null);
    setCurrentFolder(folderName);
    exportFolder(folderName, parserType);
  };

  const handleAssistFolder = (folderName: string) => {
    if (isAnyProcessing) return;
    setStartAssistTime(Date.now());
    setStopAssistTime(null);
    setCurrentFolder(folderName);
    assistFolder(folderName, parserType);
  };

  const handleDeleteFile = (file: ImportFile) => {
    if (isAnyProcessing) return;
    deleteFile(file.path);
  };

  const handlePreParseFolder = (folderName: string) => {
    if (isAnyProcessing) return;
    setCurrentFolder(folderName);
    preParseFolder(folderName, parserType);
  };

  const handleDeleteFolder = (folderName: string) => {
    if (isAnyProcessing) return;
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

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(null), 2000); // Reset message after 2 seconds
      },
      () => {
        setCopySuccess('Failed to copy!');
        setTimeout(() => setCopySuccess(null), 2000); // Reset message after 2 seconds
      },
    );
  };

  return (
    <main className="p-6">
      <h2 className="text-xl font-bold mb-4">Select a data file</h2>
      <p className="text-sm text-slate-300">{`${currentFolder || ''}`}</p>
      <div className="flex items-center space-x-4 border border-gray-300 rounded-md p-2 mb-2">
        {isLoading ? (
          <FaSpinner className="text-xl text-gray-500 animate-spin" />
        ) : (
          <FaFileImport className="text-xl text-gray-500" />
        )}
        <input
          disabled={isAnyProcessing}
          ref={fileInputRef} // Attach the ref to the input
          type="file"
          onChange={handleFileChangeWithReset} // Use the new handler with reset
          className=" w-full"
        />
      </div>

      {/* Combined Feedback Section */}
      <section>
        {combinedFeedback && (
          <div className="relative">
            <p
              className={`text-lg p-4 ${
                combinedFeedback.success
                  ? 'text-black bg-green-300'
                  : 'text-black bg-red-300'
              }`}
              dangerouslySetInnerHTML={{
                __html: combinedFeedback.message.replace(/\n/g, '<br />'),
              }}
            />
            {/* Clipboard Icon Button */}
            <button
              onClick={() => handleCopyToClipboard(combinedFeedback.message)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              title="Copy to clipboard"
            >
              <FaClipboard className="text-xl" />
            </button>
          </div>
        )}
        {copySuccess && <p className="text-sm text-green-500">{copySuccess}</p>}
      </section>

      {isProcessingAssistFolder && (
        <div>
          <section id="assist-topic-progress" className="mt-6">
            <ProgressBar
              progress={assistProgress?.topicProgress.processed || 0}
              total={assistProgress?.topicProgress.total || 1} // Avoid division by zero
              label={assistProgress?.topicProgress.message || 'Topic Progress'}
            />
          </section>
          <section id="assist-question-progress" className="mt-6">
            <ProgressBar
              progress={assistProgress?.questionProgress.processed || 0}
              total={assistProgress?.questionProgress.total || 1} // Avoid division by zero
              label={
                assistProgress?.questionProgress.message || 'Question Progress'
              }
            />
          </section>
        </div>
      )}

      {isProcessingExportFolder && (
        <div>
          <section id="assist-question-progress" className="mt-6">
            <ProgressBar
              progress={exportProgress?.processed || 0}
              total={exportProgress?.total || 1} // Avoid division by zero
              label={exportProgress?.message || 'Question Progress'}
            />
          </section>
        </div>
      )}

      <section>
        <Duration
          startTime={startAssistTime}
          stopTime={stopAssistTime}
          title="Assist"
        />
        <Duration
          startTime={startExportTime}
          stopTime={stopExportTime}
          title="Export"
        />
      </section>

      <section className="mt-2">
        <div className="flex items-center space-x-2 border-b mb-2 pl-2 pr-2">
          {isLoading ? (
            <FaSpinner className="text-base text-gray-500 animate-spin" />
          ) : (
            <FaListUl className="text-base text-gray-500" />
          )}
          <h3 className="text-base font-bold w-full ">Files</h3>
          <GlobalMoreButton
            disabled={isAnyProcessing}
            folderName={getGlobalFolderName(parserType)}
            handleAssistAll={handleAssistAll}
            handleExportAll={handleExportAll}
          />
        </div>
        {files.length === 0 && (
          <p className="text-base text-gray-500">No files available</p>
        )}
        <FileList
          disabled={isAnyProcessing}
          files={files}
          onDelete={handleDeleteFile}
          onDeleteFolder={handleDeleteFolder}
          onPreParseFolder={handlePreParseFolder}
          onAssistFolder={handleAssistFolder}
          onExportFolder={handleExportFolder}
        />
      </section>
    </main>
  );
};

export default FileManager;

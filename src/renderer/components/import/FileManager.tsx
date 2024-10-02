import { useEffect, useRef, useState, useMemo } from 'react';
import { useFileUpload, useManageFiles } from '../../hooks';
import { ParserType } from '../../../enums';
import FileList from './FileList';
import { ImportFile, Feedback } from '../../../types';
import { FaFileImport, FaSpinner, FaClipboard, FaListUl } from 'react-icons/fa';
import ProgressBar from '../ProgressBar';

interface FileManagerProps {
  parserType: ParserType;
}

const FileManager: React.FC<FileManagerProps> = ({ parserType }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [startAssistTime, setStartAssistTime] = useState<number | null>(null); // Store assist start time
  const [stopAssistTime, setStopAssistTime] = useState<number | null>(null); // Store assist stop time
  const [startExportTime, setStartExportTime] = useState<number | null>(null); // Store export start time
  const [stopExportTime, setStopExportTime] = useState<number | null>(null); // Store export stop time
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

  const handleExportFolder = (folderName: string) => {
    if (isAnyProcessing) return;
    setStartExportTime(Date.now());
    setStopExportTime(null);
    exportFolder(folderName, parserType);
  };

  const handleAssistFolder = (folderName: string) => {
    if (isAnyProcessing) return;
    setStartAssistTime(Date.now());
    setStopAssistTime(null);
    assistFolder(folderName, parserType);
  };

  const handleDeleteFile = (file: ImportFile) => {
    if (isAnyProcessing) return;
    deleteFile(file.path);
  };

  const handlePreParseFolder = (folderName: string) => {
    if (isAnyProcessing) return;
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

  const getHumanReadableDuration = (
    startTime: number,
    stopTime: number,
  ): string | null => {
    if (startTime && stopTime) {
      const durationMs = stopTime - startTime;
      const durationSeconds = durationMs / 1000;

      const days = Math.floor(durationSeconds / (3600 * 24));
      const hours = Math.floor((durationSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      const seconds = Math.floor(durationSeconds % 60);

      let durationString = '';

      if (days > 0) {
        durationString += `${days} day${days > 1 ? 's' : ''} `;
      }
      if (hours > 0) {
        durationString += `${hours} hour${hours > 1 ? 's' : ''} `;
      }
      if (minutes > 0) {
        durationString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
      }
      if (seconds > 0 || durationString === '') {
        durationString += `${seconds} second${seconds > 1 ? 's' : ''}`;
      }

      return durationString.trim(); // Remove any extra spaces at the end
    }
    return null;
  };

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
          disabled={isAnyProcessing}
          ref={fileInputRef} // Attach the ref to the input
          type="file"
          onChange={handleFileChangeWithReset} // Use the new handler with reset
          className="border border-gray-300 rounded-md p-2 w-full"
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

      {startAssistTime && stopAssistTime && (
        <section className="mt-4 text-sm text-slate-500">
          <span className="mr-4">
            Assist - Started: {new Date(startAssistTime).toLocaleTimeString()}
          </span>
          <span className="mr-4">
            Finished: {new Date(stopAssistTime).toLocaleTimeString()}
          </span>
          <span className="mr-4">
            Duration:{' '}
            {getHumanReadableDuration(startAssistTime, stopAssistTime)}
          </span>
        </section>
      )}

      {startExportTime && stopExportTime && (
        <section className="mt-4 text-sm text-slate-500">
          <span className="mr-4">
            Export - Started: {new Date(startExportTime).toLocaleTimeString()}
          </span>
          <span className="mr-4">
            Finished: {new Date(stopExportTime).toLocaleTimeString()}
          </span>
          <span className="mr-4">
            Duration:{' '}
            {getHumanReadableDuration(startExportTime, stopExportTime)}
          </span>
        </section>
      )}

      <section className="mt-6">
        <div className="flex items-center space-x-2 border-b mb-2">
          {isLoading ? (
            <FaSpinner className="text-2xl text-gray-500 animate-spin" />
          ) : (
            <FaListUl className="text-2xl text-gray-500" />
          )}
          <h3 className="text-lg font-bold w-full ">Files</h3>
        </div>
        {files.length === 0 && <p>No files available</p>}
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

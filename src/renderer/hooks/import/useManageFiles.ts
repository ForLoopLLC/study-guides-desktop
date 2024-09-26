import { useState, useEffect } from 'react';
import {
  ImportFile,
  FileListFeedback,
  DeleteFileFeedback,
} from '../../../types';
import { ParserType } from '../../../enums';

const useManageFiles = (parserType: ParserType) => {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [feedback, setFeedback] = useState<
    FileListFeedback | DeleteFileFeedback | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  // List files
  const listFiles = () => {
    setLoading(true);
    window.electron.ipcRenderer.invoke('import-list-files', { parserType });
  };

  // Delete a file
  const deleteFile = (filePath: string) => {
    setLoading(true);
    window.electron.ipcRenderer.invoke('import-delete-file', { filePath });
  };

  // Handle feedback from the main process
  const handleFileListFeedback = (payload: any) => {
    const response = payload as FileListFeedback;
    if (response.success) {
      setFiles(response.files);
    }
    setFeedback(response);
    setLoading(false);
  };

  const handleDeleteFileFeedback = (payload: any) => {
    const response = payload as DeleteFileFeedback;
    if (response.success) {
      setFiles((prevFiles) => prevFiles.filter((file) => file.path !== response.filePath));
    }
    setFeedback(response);
    setLoading(false);
  };

  useEffect(() => {
    // Subscribe to feedback events when component mounts
    const unsubscribeFileListFeedback = window.electron.ipcRenderer.on(
      'file-list-feedback',
      handleFileListFeedback,
    );

    const unsubscribeDeleteFileFeedback = window.electron.ipcRenderer.on(
      'file-delete-feedback',
      handleDeleteFileFeedback,
    );

    // Initial file listing
    listFiles();

    // Clean up listeners on unmount
    return () => {
      unsubscribeFileListFeedback();
      unsubscribeDeleteFileFeedback();
    };
  }, [parserType]);

  return {
    files,
    feedback,
    loading,
    listFiles,
    deleteFile,
  };
};

export default useManageFiles;

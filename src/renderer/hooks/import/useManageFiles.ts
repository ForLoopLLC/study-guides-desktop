import { useState, useEffect } from 'react';
import {
  ImportFile,
  FileListFeedback,
  DeleteFileFeedback,
  PreParserFeedback,
  PreParserFolderFeedback,
  DeleteFolderFeedback,
} from '../../../types';
import { ParserOperationMode, ParserType } from '../../../enums';

const useManageFiles = (parserType: ParserType) => {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [feedback, setFeedback] = useState<
    FileListFeedback | DeleteFileFeedback | PreParserFeedback | PreParserFolderFeedback | DeleteFolderFeedback | null
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

  const preParseFile = (
    filePath: string,
    parserType: ParserType,
    operationMode: ParserOperationMode,
  ) => {
    setLoading(true);
    window.electron.ipcRenderer.invoke('import-parse-file', {
      parserType,
      filePath,
      operationMode,
    });
  };

  const deleteFolder = (folder: string) => {
    setLoading(true);
    window.electron.ipcRenderer.invoke('import-delete-folder', { folder });
  };

  const preParseFolder = (
    folder: string,
    parserType: ParserType,
    operationMode: ParserOperationMode,
  ) => {
    setLoading(true);
    window.electron.ipcRenderer.invoke('import-parse-folder', {
      parserType,
      folder,
      operationMode,
    });
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
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.path !== response.filePath),
      );
    }
    setFeedback(response);
    setLoading(false);
  };

  const handlePreParseFeedback = (payload: any) => {
    const response = payload as PreParserFeedback;
    console.log(response);
    setFeedback(response);
    setLoading;
  };

  const handleDeleteFolderFeedback = (payload: any) => {
    const response = payload as DeleteFolderFeedback;
    if (response.success) {
      setFiles((prevFiles) =>
        prevFiles.filter((file) => !response.filePaths.includes(file.path)),
      );
    }
    setFeedback(response);
    setLoading(false);
  };

  const handlePreParseFolderFeedback = (payload: any) => {
    const response = payload as PreParserFeedback;
    console.log(response);
    setFeedback(response);
    setLoading;
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

    const unsubscribePreParseFeedback = window.electron.ipcRenderer.on(
      'file-parse-feedback',
      handlePreParseFeedback,
    );

    const unsubscribeDeleteFolderFeedback = window.electron.ipcRenderer.on(
      'folder-delete-feedback',
      handleDeleteFolderFeedback,
    );

    const unsubscribePreParseFolderFeedback = window.electron.ipcRenderer.on(
      'folder-parse-feedback',
      handlePreParseFolderFeedback,
    );

    // Initial file listing
    listFiles();

    // Clean up listeners on unmount
    return () => {
      unsubscribeFileListFeedback();
      unsubscribeDeleteFileFeedback();
      unsubscribePreParseFeedback();
      unsubscribeDeleteFileFeedback();
      unsubscribePreParseFolderFeedback();
    };
  }, [parserType]);

  return {
    files,
    feedback,
    loading,
    listFiles,
    deleteFile,
    deleteFolder,
    preParseFile,
    preParseFolder,
  };
};

export default useManageFiles;

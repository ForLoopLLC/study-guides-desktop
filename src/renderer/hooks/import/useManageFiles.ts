import { useState, useEffect } from 'react';
import {
  ImportFile,
  FileListFeedback,
  DeleteFileFeedback,
  PreParserFeedback,
  PreParserFolderFeedback,
  DeleteFolderFeedback,
} from '../../../types';
import { ParserType } from '../../../enums';

const useManageFiles = (parserType: ParserType) => {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [feedback, setFeedback] = useState<
    | FileListFeedback
    | DeleteFileFeedback
    | PreParserFeedback
    | PreParserFolderFeedback
    | DeleteFolderFeedback
    | null
  >(null);

  // Separate loading states for each action
  const [isProcessingList, setIsProcessingList] = useState<boolean>(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState<boolean>(false);
  const [isProcessingPreParse, setIsProcessingPreParse] =
    useState<boolean>(false);
  const [isProcessingDeleteFolder, setIsProcessingDeleteFolder] =
    useState<boolean>(false);
  const [isProcessingPreParseFolder, setIsProcessingPreParseFolder] =
    useState<boolean>(false);

  // List files
  const listFiles = () => {
    setIsProcessingList(true);
    window.electron.ipcRenderer.invoke('import-list-files', { parserType });
  };

  // Delete a file
  const deleteFile = (filePath: string) => {
    setIsProcessingDelete(true);
    window.electron.ipcRenderer.invoke('import-delete-file', { filePath });
  };

  // Pre-parse a file
  const preParseFile = (
    filePath: string,
    parserType: ParserType,
  ) => {
    setIsProcessingPreParse(true);
    window.electron.ipcRenderer.invoke('import-parse-file', {
      parserType,
      filePath,
    });
  };

  // Delete a folder
  const deleteFolder = (folderName: string) => {
    setIsProcessingDeleteFolder(true);
    window.electron.ipcRenderer.invoke('import-delete-folder', {
      folderName,
      parserType,
    });
  };

  // Pre-parse a folder
  const preParseFolder = (
    folderName: string,
    parserType: ParserType,
  ) => {
    setIsProcessingPreParseFolder(true);
    window.electron.ipcRenderer.invoke('import-parse-folder', {
      parserType,
      folderName,
    });
  };

  // Handle feedback from the main process
  const handleFileListFeedback = (payload: any) => {
    setIsProcessingList(false);
    const response = payload as FileListFeedback;
    if (response.success) {
      setFiles(response.files);
    }
    setFeedback(response);
  };

  const handleDeleteFileFeedback = (payload: any) => {
    setIsProcessingDelete(false);
    const response = payload as DeleteFileFeedback;
    if (response.success) {
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.path !== response.filePath),
      );
    }
    setFeedback(response);
  };

  const handlePreParseFeedback = (payload: any) => {
    setIsProcessingPreParse(false);
    const response = payload as PreParserFeedback;
    setFeedback(response);
  };

  const handleDeleteFolderFeedback = (payload: any) => {
    setIsProcessingDeleteFolder(false);
    const response = payload as DeleteFolderFeedback;
    if (response.success) {
      listFiles();
    }
    setFeedback(response);
  };

  const handlePreParseFolderFeedback = (payload: any) => {
    setIsProcessingPreParseFolder(false);
    const response = payload as PreParserFolderFeedback;
    setFeedback(response);
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
      unsubscribeDeleteFolderFeedback();
      unsubscribePreParseFolderFeedback();
    };
  }, [parserType]);

  return {
    files,
    feedback,
    isProcessingList,
    isProcessingDelete,
    isProcessingPreParse,
    isProcessingDeleteFolder,
    isProcessingPreParseFolder,
    listFiles,
    deleteFile,
    deleteFolder,
    preParseFile,
    preParseFolder,
  };
};

export default useManageFiles;

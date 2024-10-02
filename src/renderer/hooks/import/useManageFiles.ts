import { useState, useEffect } from 'react';
import {
  ImportFile,
  FileListFeedback,
  DeleteFileFeedback,
  PreParserFeedback,
  PreParserFolderFeedback,
  DeleteFolderFeedback,
  AssistFolderFeedback,
  AssistFolderProgress,
  ExportFolderFeedback,
} from '../../../types';
import { ParserType, Channels } from '../../../enums';

const useManageFiles = (parserType: ParserType) => {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [progress, setProgress] = useState<AssistFolderProgress | null>(null);
  const [feedback, setFeedback] = useState<
    | FileListFeedback
    | DeleteFileFeedback
    | PreParserFeedback
    | PreParserFolderFeedback
    | DeleteFolderFeedback
    | AssistFolderFeedback
    | ExportFolderFeedback
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
  const [isProcessingAssistFolder, setIsProcessingAssistFolder] =
    useState<boolean>(false);
  const [isProcessingExportFolder, setIsProcessingExportFolder] =
    useState<boolean>(false);

  // List files
  const listFiles = () => {
    setIsProcessingList(true);
    setFeedback(null);
    setProgress(null);
    window.electron.ipcRenderer.invoke(Channels.ListFiles, { parserType });
  };

  // Delete a file
  const deleteFile = (filePath: string) => {
    setIsProcessingDelete(true);
    setFeedback(null);
    setProgress(null);
    window.electron.ipcRenderer.invoke(Channels.DeleteFile, { filePath });
  };

  // Pre-parse a file
  const preParseFile = (filePath: string, parserType: ParserType) => {
    setIsProcessingPreParse(true);
    setFeedback(null);
    setProgress(null);
    window.electron.ipcRenderer.invoke(Channels.ParseFile, {
      parserType,
      filePath,
    });
  };

  // Delete a folder
  const deleteFolder = (folderName: string) => {
    setIsProcessingDeleteFolder(true);
    setFeedback(null);
    setProgress(null);
    window.electron.ipcRenderer.invoke(Channels.DeleteFolder, {
      folderName,
      parserType,
    });
  };

  // Pre-parse a folder
  const preParseFolder = (folderName: string, parserType: ParserType) => {
    setIsProcessingPreParseFolder(true);
    setFeedback(null);
    setProgress(null);
    window.electron.ipcRenderer.invoke(Channels.ParseFolder, {
      parserType,
      folderName,
    });
  };

  // AI assist a folder
  const assistFolder = (folderName: string, parserType: ParserType) => {
    setIsProcessingAssistFolder(true);
    setFeedback(null);
    setProgress(null);
    window.electron.ipcRenderer.invoke(Channels.AssistFolder, {
      parserType,
      folderName,
    });
  };

  // Export a folder
  const exportFolder = (folderName: string, parserType: ParserType) => {
    setIsProcessingExportFolder(true);
    setFeedback(null);
    setProgress(null);
    window.electron.ipcRenderer.invoke(Channels.ExportFolder, {
      folderName,
      parserType,
    });
  };

  const handleExportFolderFeedback = (payload: any) => {
    setIsProcessingExportFolder(false);
    const response = payload as ExportFolderFeedback;
    setFeedback(response);
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

  const handleAssistFolderFeedback = (payload: any) => {
    setIsProcessingAssistFolder(false);
    const response = payload as AssistFolderFeedback;
    setFeedback(response);
  };

  const handleAssistFolderProgress = (payload: any) => {
    setProgress(payload as AssistFolderProgress);
  };

  useEffect(() => {
    // Subscribe to feedback events when component mounts
    const unsubscribeFileListFeedback = window.electron.ipcRenderer.on(
      Channels.ListFilesFeedback,
      handleFileListFeedback,
    );

    const unsubscribeDeleteFileFeedback = window.electron.ipcRenderer.on(
      Channels.DeleteFileFeedback,
      handleDeleteFileFeedback,
    );

    const unsubscribePreParseFeedback = window.electron.ipcRenderer.on(
      Channels.ParseFileFeedback,
      handlePreParseFeedback,
    );

    const unsubscribeDeleteFolderFeedback = window.electron.ipcRenderer.on(
      Channels.DeleteFolderFeedback,
      handleDeleteFolderFeedback,
    );

    const unsubscribePreParseFolderFeedback = window.electron.ipcRenderer.on(
      Channels.ParseFolderFeedback,
      handlePreParseFolderFeedback,
    );

    const unsubscribeAssistFolderFeedback = window.electron.ipcRenderer.on(
      Channels.AssistFeedback,
      handleAssistFolderFeedback,
    );

    const unsubscribeAssistFolderProgress = window.electron.ipcRenderer.on(
      Channels.AssistProgress,
      handleAssistFolderProgress,
    );

    const unsubscribeExportFolderProgress = window.electron.ipcRenderer.on(
      Channels.ExportFolderProgress,
      handleExportFolderFeedback,
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
      unsubscribeAssistFolderFeedback();
      unsubscribeAssistFolderProgress();
      unsubscribeExportFolderProgress();
    };
  }, [parserType]);

  return {
    files,
    feedback,
    progress,
    isProcessingList,
    isProcessingDelete,
    isProcessingPreParse,
    isProcessingDeleteFolder,
    isProcessingPreParseFolder,
    isProcessingAssistFolder,
    isProcessingExportFolder,
    listFiles,
    deleteFile,
    deleteFolder,
    preParseFile,
    preParseFolder,
    assistFolder,
    exportFolder,
  };
};

export default useManageFiles;

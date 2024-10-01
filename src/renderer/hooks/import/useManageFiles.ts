import { useState, useEffect } from 'react';
import {
  ImportFile,
  FileListFeedback,
  DeleteFileFeedback,
  PreParserFeedback,
  PreParserFolderFeedback,
  DeleteFolderFeedback,
  AssistFolderFeedback,
} from '../../../types';
import { ParserType, Channels } from '../../../enums';

const useManageFiles = (parserType: ParserType) => {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [feedback, setFeedback] = useState<
    | FileListFeedback
    | DeleteFileFeedback
    | PreParserFeedback
    | PreParserFolderFeedback
    | DeleteFolderFeedback
    | AssistFolderFeedback
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

  // List files
  const listFiles = () => {
    setIsProcessingList(true);
    window.electron.ipcRenderer.invoke(Channels.ListFiles, { parserType });
  };

  // Delete a file
  const deleteFile = (filePath: string) => {
    setIsProcessingDelete(true);
    window.electron.ipcRenderer.invoke(Channels.DeleteFile, { filePath });
  };

  // Pre-parse a file
  const preParseFile = (
    filePath: string,
    parserType: ParserType,
  ) => {
    setIsProcessingPreParse(true);
    window.electron.ipcRenderer.invoke(Channels.ParseFile, {
      parserType,
      filePath,
    });
  };

  // Delete a folder
  const deleteFolder = (folderName: string) => {
    setIsProcessingDeleteFolder(true);
    window.electron.ipcRenderer.invoke(Channels.DeleteFolder, {
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
    window.electron.ipcRenderer.invoke(Channels.ParseFolder, {
      parserType,
      folderName,
    });
  };

  // AI assist a folder
  const assistFolder = (
    folderName: string,
    parserType: ParserType,
  ) => {
    setIsProcessingAssistFolder(true);
    window.electron.ipcRenderer.invoke(Channels.AssistFolder, {
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

  const handleAssistFolderFeedback = (payload: any) => {
    setIsProcessingAssistFolder(false);
    const response = payload as AssistFolderFeedback;
    setFeedback(response);
  }

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
    assistFolder,
  };
};

export default useManageFiles;

import { useState, useEffect } from 'react';
import { Feedback } from '../../../types';
import { ParserType, Channels } from '../../../enums';

const useFileUpload = (parserType: ParserType) => {
  const [filePath, setFilePath] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFilePath(file.path);
      setIsLoading(true); // Set loading to true when file is being processed

      // Send file to main process to copy to local working directory
      window.electron.ipcRenderer.invoke(Channels.ImportFile, {
        filePath: file.path,
        parserType,
      });
    }
  };

  const handleFeedback = (payload: any) => {
    const data = payload as Feedback;
    setFeedback(data);
    setIsLoading(false); // Set loading to false when feedback is received
  };

  useEffect(() => {
    // Subscribe to the feedback event when component mounts
    const unsubscribeFeedback = window.electron.ipcRenderer.on(
      Channels.ImportFeedback,
      handleFeedback,
    );

    return () => {
      unsubscribeFeedback(); // Ensure the listener is removed
    };
  }, []);

  return {
    filePath,
    feedback,
    isLoading, // Return isLoading state
    handleFileChange,
  };
};

export default useFileUpload;

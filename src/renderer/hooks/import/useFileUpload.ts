import { useState, useEffect } from 'react';
import { Feedback } from '../../../types';
import { ParserType } from '../../../enums';

const useFileUpload = (parserType: ParserType) => {
  const [filePath, setFilePath] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFilePath(file.path);

      // Send file to main process to copy to local working directory
      window.electron.ipcRenderer.invoke('import-file-to-local', {
        filePath: file.path,
        parserType,
      });
    }
  };

  const handleFeedback = (payload: any) => {
    const data = payload as Feedback;
    setFeedback(data);
  };

  useEffect(() => {
    // Subscribe to the feedback event when component mounts
    const unsubscribeFeedback = window.electron.ipcRenderer.on(
      'file-import-feedback',
      handleFeedback,
    );

    return () => {
      unsubscribeFeedback(); // Ensure the listener is removed
    };
  }, []);

  return {
    filePath,
    feedback,
    handleFileChange,
  };
};

export default useFileUpload;

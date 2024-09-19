import { useState, useEffect } from 'react';

export const useLogTail = () => {
  const [logContent, setLogContent] = useState<string>(() => {
    return localStorage.getItem('logContent') || ''; // Initialize from localStorage
  });
  const [isTailing, setIsTailing] = useState<boolean>(false);

  useEffect(() => {
    // Listener for log updates from the main process
    const handleLogUpdate = (newContent: any) => {
        console.log("handling log update", newContent)
      setLogContent(prev => {
        const updatedContent =  prev + newContent; // Skip appending on first load
        localStorage.setItem('logContent', updatedContent); // Save to localStorage
        return updatedContent;
      });

    };

    const removeListener = window.electron.ipcRenderer.on('log-update', handleLogUpdate);

    return () => {
      removeListener();
    };
  }, []);

  const startTail = () => {
    if (!isTailing) {
      window.electron.ipcRenderer.invoke('start-tail-log');
      setIsTailing(true);
    }
  };

  const stopTail = () => {
    if (isTailing) {
      window.electron.ipcRenderer.invoke('stop-tail-log');
      setIsTailing(false);
    }
  };

  // Function to clear log content and remove it from localStorage
  const clearLogs = () => {
    setLogContent(''); // Clear the log content from state
    localStorage.removeItem('logContent'); // Remove the content from localStorage
  };

  return {
    logContent,
    isTailing,
    startTail,
    stopTail,
    clearLogs, // Return clearLogs so it can be used in the component
  };
};

export default useLogTail;

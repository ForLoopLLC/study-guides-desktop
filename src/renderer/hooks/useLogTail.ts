import { useState, useEffect } from 'react';

export const useLogTail = () => {
  const [logContent, setLogContent] = useState<string[]>(() => {
    const storedLogs = localStorage.getItem('logContent');
    return storedLogs ? JSON.parse(storedLogs) : [];
  });
  const [isTailing, setIsTailing] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true); // Track the first load

  useEffect(() => {
    // Listener for log updates from the main process
    const handleLogUpdate = (newContent: any) => {
      setLogContent(prev => {
        const updatedContent = [newContent, ...prev]; // Prepend new content
        localStorage.setItem('logContent', JSON.stringify(updatedContent)); // Save to localStorage
        return updatedContent;
      });

      if (isFirstLoad) {
        setIsFirstLoad(false); // Mark first load as complete
      }
    };

    const removeListener = window.electron.ipcRenderer.on('log-update', handleLogUpdate);

    return () => {
      removeListener();
    };
  }, [isFirstLoad]);

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

  const clearLogs = () => {
    setLogContent([]); // Clear the log content from state
    localStorage.removeItem('logContent'); // Remove the content from localStorage
  };

  return {
    logContent: logContent.join('\n'), // Convert array to string for rendering
    isTailing,
    startTail,
    stopTail,
    clearLogs,
  };
};

export default useLogTail;

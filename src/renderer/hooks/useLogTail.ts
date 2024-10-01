import { useState, useEffect } from 'react';
import { Channels } from '../../enums';

export const useLogTail = (keyName: string) => {
  const [logContent, setLogContent] = useState<string[]>(() => {
    const storedLogs = localStorage.getItem(keyName);
    return storedLogs ? JSON.parse(storedLogs) : [];
  });
  const [isTailing, setIsTailing] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true); // Track the first load

  useEffect(() => {
    // Listener for log updates from the main process
    const handleLogUpdate = (newContent: any) => {
      setLogContent(prev => {
        const updatedContent = [newContent, ...prev]; // Prepend new content
        localStorage.setItem(keyName, JSON.stringify(updatedContent)); // Save to localStorage
        return updatedContent;
      });

      if (isFirstLoad) {
        setIsFirstLoad(false); // Mark first load as complete
      }
    };

    const removeListener = window.electron.ipcRenderer.on(Channels.LogUpdate, handleLogUpdate);

    return () => {
      removeListener();
    };
  }, [isFirstLoad]);

  const startTail = () => {
    if (!isTailing) {
      window.electron.ipcRenderer.invoke(Channels.StartTailLog);
      setIsTailing(true);
    }
  };

  const stopTail = () => {
    if (isTailing) {
      window.electron.ipcRenderer.invoke(Channels.StopTailLog);
      setIsTailing(false);
    }
  };

  const clearLogs = () => {
    setLogContent([]); // Clear the log content from state
    localStorage.removeItem(keyName); // Remove the content from localStorage
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

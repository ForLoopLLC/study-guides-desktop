import { useState, useEffect } from 'react';

export const useLogTail = () => {
  const [logContent, setLogContent] = useState<string>('');
  const [isTailing, setIsTailing] = useState<boolean>(false);

  useEffect(() => {
    // Listener for log updates from the main process
    const handleLogUpdate = (newContent: any) => {
      if (typeof newContent === 'string') {
        setLogContent(prev => prev + newContent);
      }
    };

    // Register the IPC listener and get the remove function
    const removeListener = window.electron.ipcRenderer.on('log-update', handleLogUpdate);

    // Clean up listener on component unmount
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

  return {
    logContent,
    isTailing,
    startTail,
    stopTail,
  };
};

export default useLogTail;

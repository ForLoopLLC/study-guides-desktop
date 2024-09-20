import { useState, useEffect, useCallback } from 'react';
import { UserFilter, Environment } from '../../../types';

const usePublishTagsIndex = (
  filter: UserFilter,
  query: string,
  env: Environment,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle publishing index
  const publishIndex = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsComplete(false);
      setError(null);
      setProgress(0);
      setTotalProcessed(0);
      console.log('publish-users-index', filter, query);
      await window.electron.ipcRenderer.invoke('publish-users-index', {
        filter,
        query,
      });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setIsLoading(false);
    }
  }, [filter, query]);

  useEffect(() => {
    // Reset states when the environment changes
    setIsLoading(false);
    setProgress(0);
    setTotalProcessed(0);
    setIsComplete(false);
    setError(null);
  }, [filter, query, env]);

  useEffect(() => {
    // Listen for progress updates from the main process
    const handleProgress = (payload: any) => {
      const { page, totalProcessed } = payload;
      setProgress(page);
      setTotalProcessed(totalProcessed);
    };

    // Listen for completion
    const handleComplete = (payload: any) => {
      const { totalProcessed } = payload;
      setIsLoading(false);
      setIsComplete(true);
      setProgress(100); // Set progress to 100% on complete
    };

    // Listen for errors
    const handleError = (payload: any) => {
      const { message } = payload;
      setIsLoading(false);
      setError(message);
    };

    // Register the listeners
    const unsubscribeProgress = window.electron.ipcRenderer.on(
      'publish-users-index-progress',
      handleProgress,
    );
    const unsubscribeComplete = window.electron.ipcRenderer.on(
      'publish-users-index-complete',
      handleComplete,
    );
    const unsubscribeError = window.electron.ipcRenderer.on(
      'publish-users-index-error',
      handleError,
    );

    // Clean up the listeners on unmount
    return () => {
      unsubscribeProgress();
      unsubscribeComplete();
      unsubscribeError();
    };
  }, []);

  return {
    publishIndex,
    isLoading,
    progress,
    totalProcessed,
    isComplete,
    error,
  };
};

export default usePublishTagsIndex;

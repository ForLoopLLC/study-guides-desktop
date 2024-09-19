import { useState } from 'react';
import { cleanIpcError } from '../../util';

const useClearTagReports = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  const clearReports = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke('clear-tag-reports', id);

      if (result.error) {
        setError(cleanIpcError(result.error, 'clear-tag-reports'));
      } else {
        setSuccess(true);
      }
    } catch (error) {
      const err = error as Error;
      setError(cleanIpcError(err.message, 'clear-tag-reports'));
    } finally {
      setIsLoading(false);
    }
  };

  return { clearReports, isLoading, success, error , resetStatus};
};

export default useClearTagReports;

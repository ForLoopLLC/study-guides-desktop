import { useState } from 'react';
import { cleanIpcError } from '../../util';

const useDeleteTag = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  const deleteTag = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke('delete-tag', id);

      if (result.error) {
        setError(cleanIpcError(result.error, 'delete-tag'));
      } else {
        setSuccess(true);
      }
    } catch (error) {
      const err = error as Error;
      setError(cleanIpcError(err.message, 'delete-tag'));
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTag, isLoading, success, error , resetStatus};
};

export default useDeleteTag;

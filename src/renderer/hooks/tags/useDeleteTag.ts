import { useState } from 'react';
import { cleanIpcError } from '../../util';
import { Channels } from '../../../enums';

const useDeleteTag = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  const deleteTag = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke(Channels.DeleteTag, id);

      if (result.error) {
        setError(cleanIpcError(result.error, Channels.DeleteTag));
        return false;
      } else {
        setSuccess(true);
        return true;
      }
    } catch (error) {
      const err = error as Error;
      setError(cleanIpcError(err.message, Channels.DeleteTag));
      return false; 
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTag, isLoading, success, error , resetStatus};
};

export default useDeleteTag;

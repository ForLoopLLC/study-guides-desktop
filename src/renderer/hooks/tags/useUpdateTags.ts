import { useState } from 'react';
import { Tag } from '../../../types';

const useUpdateTags = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateTags = async (updatedTags: Tag[]) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke('update-tags', updatedTags);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to update tags');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTags, isLoading, success, error };
};

export default useUpdateTags;

import { useState } from 'react';
import { Tag } from '../../../types/tag';

const useUpdateTag = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  const updateTag = async (updatedTag: Tag) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke(
        'update-tag',
        updatedTag,
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to update tag');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTag, isLoading, success, error, resetStatus };
};

export default useUpdateTag;

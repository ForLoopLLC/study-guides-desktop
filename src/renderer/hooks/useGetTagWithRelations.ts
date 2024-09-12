import { useState, useCallback } from 'react';
import { TagWithRelations } from '../../types';

const useGetTagWithRelations = () => {
  const [tag, setTag] = useState<TagWithRelations | null>(null); // Initialize with null
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTag = useCallback(async (id: string) => {
    if (!id) {
      setError('Tag ID is required');
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors before fetch
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'get-tag-with-relations',
        id,
      );

      setTag(result);
    } catch (err) {
      setError('Failed to load tag');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTag(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { tag, error, isLoading, fetchTag, reset };
};

export default useGetTagWithRelations;

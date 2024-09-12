import { useState, useEffect, useCallback } from 'react';
import { Tag } from '../../types/tag';
import { Environment } from '../../types';

const useGetTagWithRelations = (id: string, environment: Environment) => {
  const [tag, setTag] = useState<Tag | null>(null); // Initialize with null
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTag = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors before fetch
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'get-tags-with-relations',
        id,
      );
      if (result.error) {
        setError(result.error);
      } else {
        setTag(result.data);
      }
    } catch {
      setError('Failed to load tag');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTag(); // Fetch tag only if id is provided
    }
  }, [id, fetchTag, environment]);

  return { tag, error, isLoading, refetch: fetchTag };
};

export default useGetTagWithRelations;

import { useState, useEffect, useCallback } from 'react';
import { Tag } from '../../types/tag';
import { Environment, TagFilter } from '../../types';

export const useGetTags = (
  page: number = 1,
  limit: number = 10,
  filter: TagFilter = 'All',
  environment: Environment,
) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Create a function to fetch tags, used by both the effect and refetch
  const fetchTags = useCallback(async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-tags', {
        page,
        limit,
        filter,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setTags(result.data);
        setTotal(result.total); // Save total count of tags for pagination
      }
    } catch (err) {
      setError('Failed to load tags');
    }
  }, [page, limit, filter]);

  // Automatically fetch tags when dependencies change
  useEffect(() => {
    fetchTags();
  }, [fetchTags, environment]);

  // Return the fetched data, error, and a refetch function
  return { tags, total, error, refetch: fetchTags };
};

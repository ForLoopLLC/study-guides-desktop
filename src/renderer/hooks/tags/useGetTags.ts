import { useState, useEffect, useCallback } from 'react';
import { Tag } from '../../../types/tag';
import { Environment, TagFilter } from '../../../types';
import { Channels } from '../../../enums';

const useGetTags = (
  page: number = 1,
  limit: number = 10,
  filter: TagFilter = 'All',
  query: string = '',
  environment: Environment,
) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

  // Create a function to fetch tags, used by both the effect and refetch
  const fetchTags = useCallback(async () => {
    setIsLoading(true); // Set loading to true when fetch starts
    try {
      const result = await window.electron.ipcRenderer.invoke(Channels.GetTags, {
        page,
        limit,
        filter,
        query,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setTags(result.data);
        setTotal(result.total); // Save total count of tags for pagination
      }
    } catch (err) {
      setError('Failed to load tags');
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes
    }
  }, [page, limit, filter, query]);

  // Automatically fetch tags when dependencies change
  useEffect(() => {
    fetchTags();
  }, [fetchTags, environment]);

  // Return the fetched data, error, loading state, and a refetch function
  return { tags, total, error, isLoading, refetch: fetchTags };
};

export default useGetTags;

import { useState, useEffect, useCallback } from 'react';
import { User } from '../../../types';
import { Environment, UserFilter } from '../../../types';
import { Channels } from '../../../enums';

const useGetUsers = (
  page: number = 1,
  limit: number = 10,
  filter: UserFilter = 'All',
  query: string = '',
  environment: Environment,
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

  // Create a function to fetch tags, used by both the effect and refetch
  const fetchUsers = useCallback(async () => {
    setIsLoading(true); // Set loading to true when fetch starts
    try {
      const result = await window.electron.ipcRenderer.invoke(Channels.GetUsers, {
        page,
        limit,
        filter,
        query,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.data);
        setTotal(result.total); // Save total count of tags for pagination
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes
    }
  }, [page, limit, filter, query]);

  // Automatically fetch tags when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, environment]);

  // Return the fetched data, error, loading state, and a refetch function
  return { users, total, error, isLoading, refetch: fetchUsers };
};

export default useGetUsers;

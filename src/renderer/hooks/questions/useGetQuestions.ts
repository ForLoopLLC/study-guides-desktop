import { useState, useEffect, useCallback } from 'react';
import { Question } from '../../../types';
import { Environment, QuestionFilter } from '../../../types';

const useGetQuestions = (
  page: number = 1,
  limit: number = 10,
  filter: QuestionFilter = 'All',
  query: string = '',
  environment: Environment,
) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

  // Create a function to fetch questions, used by both the effect and refetch
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true); // Set loading to true when fetch starts
    try {
      const result = await window.electron.ipcRenderer.invoke('get-questions', {
        page,
        limit,
        filter,
        query,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setQuestions(result.data);
        setTotal(result.total); // Save total count of questions for pagination
      }
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes
    }
  }, [page, limit, filter, query]);

  // Automatically fetch questions when dependencies change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions, environment]);

  // Return the fetched data, error, loading state, and a refetch function
  return { questions, total, error, isLoading, refetch: fetchQuestions };
};

export default useGetQuestions;

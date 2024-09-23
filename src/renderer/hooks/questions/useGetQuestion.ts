import { useState, useCallback } from 'react';
import { Question } from '../../../types';

const useGetQuestion = () => {
  const [question, setQuestion] = useState<Question | null>(null); // Initialize with null
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchQuestion = useCallback(async (id: string) => {
    if (!id) {
      setError('Tag ID is required');
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors before fetch
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'get-question',
        id,
      );

      setQuestion(result);
    } catch (err) {
      setError('Failed to load question');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setQuestion(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { question, error, isLoading, fetchQuestion, reset };
};

export default useGetQuestion;

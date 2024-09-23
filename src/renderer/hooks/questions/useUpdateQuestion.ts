import { useState } from 'react';
import { Question } from '../../../types';

const useUpdateQuestion = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  const updateQuestion = async (updatedQuestion: Question) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke(
        'update-question',
        updatedQuestion,
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to update question');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateQuestion, isLoading, success, error, resetStatus };
};

export default useUpdateQuestion;

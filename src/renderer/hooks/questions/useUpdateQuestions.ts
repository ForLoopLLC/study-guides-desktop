import { useState } from 'react';
import { Question } from '../../../types';

const useUpdateQuestions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateQuestions = async (udpatedQuestions: Question[]) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke(
        'update-questions',
        udpatedQuestions,
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to update questions');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateQuestions, isLoading, success, error };
};

export default useUpdateQuestions;

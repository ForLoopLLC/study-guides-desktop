import { useState } from 'react';
import { User } from '../../../types';

const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  const updateUser = async (updatedUser: User) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await window.electron.ipcRenderer.invoke(
        'update-user',
        updatedUser,
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, success, error, resetStatus };
};

export default useUpdateUser;

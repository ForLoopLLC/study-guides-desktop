import { useState, useEffect } from 'react';

const useLocalStatus = (globalSuccess: boolean, globalError: string | null) => {
  const [localSuccess, setLocalSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Update local success and error messages when the global states change
  useEffect(() => {
    if (globalSuccess) {
      setLocalSuccess(true);
    }
    if (globalError) {
      setLocalError(globalError);
    }
  }, [globalSuccess, globalError]);

  // Provide reset functions to clear success and error
  const resetStatus = () => {
    setLocalSuccess(false);
    setLocalError(null);
  };

  return {
    localSuccess,
    localError,
    resetStatus,
  };
};

export default useLocalStatus;

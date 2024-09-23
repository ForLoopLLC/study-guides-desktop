import { useState, useEffect } from 'react';

const useLocalStatus = (
  updateSuccess: boolean,
  updateError: string | null,
  deleteSuccess: boolean,
  deleteError: string | null
) => {
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (updateSuccess) {
      setLocalSuccess('Updated successfully!');
    } else if (deleteSuccess) {
      setLocalSuccess('Deleted successfully!');
    }
    if (updateError) {
      setLocalError(updateError);
    } else if (deleteError) {
      setLocalError(deleteError);
    }
  }, [updateSuccess, updateError, deleteSuccess, deleteError]);

  const resetStatus = () => {
    setLocalSuccess(null);
    setLocalError(null);
  };

  return { localSuccess, localError, resetStatus };
};


export default useLocalStatus;

import { useState } from 'react';

const useClearQuestionReports = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearReports = async (id: string): Promise<boolean | null> => {
    setIsLoading(true);
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'clear-question-reports',
        id,
      );

      if (result.error) {
        throw new Error(result.error);
      }
      return true;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to clear reports for ${id}. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { clearReports, isLoading };
};

export default useClearQuestionReports;

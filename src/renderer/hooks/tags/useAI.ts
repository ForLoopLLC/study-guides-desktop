import { useState } from 'react';
import { UpdateTagInput } from '../../../types';

const useAI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTagInput = async (tagId: string): Promise<UpdateTagInput | null> => {
    setIsLoading(true);

    try {
      const input = await window.electron.ipcRenderer.invoke(
        'get-ai-tag',
        tagId,
      );

      return input;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get AI tag assist for ${tagId}. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getContentRatingInput = async (tagId: string): Promise<UpdateTagInput | null> => {
    setIsLoading(true);

    try {
      const input = await window.electron.ipcRenderer.invoke(
        'get-ai-content-rating',
        tagId,
      );

      return input;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get AI tag content rating for ${tagId}. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { getTagInput, getContentRatingInput, isLoading };
};

export default useAI;

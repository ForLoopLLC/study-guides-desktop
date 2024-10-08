import { useState } from 'react';
import { UpdateTagInput } from '../../../types';
import { Channels } from '../../../enums';

const useTagAI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTagInput = async (tagId: string): Promise<UpdateTagInput | null> => {
    setIsLoading(true);

    try {
      const input = await window.electron.ipcRenderer.invoke(
        Channels.AssistTag,
        tagId,
      );

      if (input.error) {
        throw new Error(input.error);
      }

      return input;
    } catch (error) {
      const err = error as Error;
      throw new Error(
        `Failed to get AI tag assist for ${tagId}. ${err.message}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { getTagInput, isLoading };
};

export default useTagAI;

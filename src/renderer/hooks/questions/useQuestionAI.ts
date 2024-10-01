import { useState } from 'react';
import { UpdateQuestionInput } from '../../../types';
import { Channels } from '../../../enums';

const useQuestionAI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getQuestionInput = async (
    questionId: string,
  ): Promise<UpdateQuestionInput | null> => {
    setIsLoading(true);

    try {
      const input = await window.electron.ipcRenderer.invoke(
        Channels.AssistQuestion,
        questionId,
      );

      if (input.error) {
        throw new Error(input.error);
      }

      return input;
    } catch (error) {
      const err = error as Error;
      throw new Error(
        `Failed to get AI question assist for ${questionId}. ${err.message}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { getQuestionInput, isLoading };
};

export default useQuestionAI;

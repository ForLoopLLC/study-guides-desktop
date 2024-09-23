import { Question } from '@prisma/client';
import { log } from '../../../main';
import { generateChatCompletion } from '../generateChatCompletion';
import { distractorPrompt } from './prompts';
import { AIDistractorsResponse } from '../../../../types';
import { prepareQuestion } from './prepareQuestion';

const getDistractors = async (question: Question): Promise<AIDistractorsResponse> => {
  const preparedQuestion = prepareQuestion(question);
  const result = await generateChatCompletion(
    distractorPrompt.text,
    preparedQuestion,
  );

  const defaultResponse = {
    distractors: [],
  };
  
  try {
    const parsedResult = JSON.parse(result);
    return parsedResult as AIDistractorsResponse;

  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    return defaultResponse;
  }
};

export default getDistractors;

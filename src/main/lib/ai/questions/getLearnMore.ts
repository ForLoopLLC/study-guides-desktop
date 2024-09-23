import { Question } from '@prisma/client';
import { generateChatCompletion } from '../generateChatCompletion';
import { learnMorePrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';
import { AILearnMoreResponse } from '../../../../types';
import { log } from '../../../main';

const getLearnMore = async (question: Question):Promise<AILearnMoreResponse> => {
  const preparedQuestion = prepareQuestion(question);
  const result =  await generateChatCompletion(learnMorePrompt.text, preparedQuestion);

  const defaultResonse = {
    learnMore: '',
  };

  try {
    const parsedResult = JSON.parse(result);
    return parsedResult as AILearnMoreResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    return defaultResonse;
  }
};

export default getLearnMore;

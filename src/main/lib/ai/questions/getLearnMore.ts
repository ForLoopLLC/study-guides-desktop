import { Question } from '@prisma/client';
import { generateChatCompletion } from '../generateChatCompletion';
import { learnMorePrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';
import { log } from '../../../main';

const getLearnMore = async (question: Question):Promise<string> => {
  const preparedQuestion = prepareQuestion(question);
  const result =  await generateChatCompletion(learnMorePrompt.text, preparedQuestion);

  const defaultResonse = {
    learnMore: '',
  };

  return result;
};

export default getLearnMore;

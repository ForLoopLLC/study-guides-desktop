import { Question } from '@prisma/client';
import { generateChatCompletion } from '../generateChatCompletion';
import { learnMorePrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';

const getLearnMore = async (question: Question) => {
  const preparedQuestion = prepareQuestion(question);
  return generateChatCompletion(learnMorePrompt.text, preparedQuestion);
};

export default getLearnMore;

import { Question } from '@prisma/client';
import { generateChatCompletion } from '../generateChatCompletion';
import { learnMorePrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';

export const getLearnMore = async (question: Question) => {
  const preparedQuestion = prepareQuestion(question);
  if (!prompt) {
    throw new Error('Prompt not found');
  }
  return generateChatCompletion(learnMorePrompt.text, preparedQuestion);
};

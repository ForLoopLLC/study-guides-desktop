import { Question } from '@prisma/client';
import { log } from '../../../main';
import { generateChatCompletion } from '../generateChatCompletion';
import { distractorPrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';

const getDistractors = async (question: Question): Promise<string> => {
  const preparedQuestion = prepareQuestion(question);
  const result = await generateChatCompletion(
    distractorPrompt.text,
    preparedQuestion,
  );
  
  return result;
};

export default getDistractors;

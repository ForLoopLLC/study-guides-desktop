import { Question } from '@prisma/client';

import { AIQuestionResponse } from '../../../../types';
import { log } from '../../../main';
import { generateChatCompletion } from '../generateChatCompletion';
import { questionPrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';
import { parseAIQuestionResponse } from './parsers';

const getQuestionAssist = async (
  question: Question,
): Promise<AIQuestionResponse> => {
  const preparedQuestion = prepareQuestion(question, true);
  const raw = await generateChatCompletion(
    questionPrompt.text,
    preparedQuestion,
  );

  try {
    const parsed = parseAIQuestionResponse(raw);
    return parsed as AIQuestionResponse;

  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result could not be parsed. ${err.message}.`);
    log.error('ai', `Raw result. ${raw}.`);
    throw new Error('The result could not be parsed.');
  }
};

export default getQuestionAssist;

import { Question } from '@prisma/client';

import { AIQuestionResponse } from '../../../../types';
import { log } from '../../../main';
import { generateChatCompletion } from '../generateChatCompletion';
import { questionPrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';

export const defaultResponse = {
  learnMore: '',
  distractors: [],
  metaTags: [],
};

const cleanResponse = (
  aiResponse: AIQuestionResponse,
): AIQuestionResponse => {
  const cleanedResponse: AIQuestionResponse = {
    distractors: aiResponse.distractors.map((d: string) => {
      const trimmed = d.trim();
      return trimmed.endsWith('.') ? trimmed.slice(0, -1) : trimmed;
    }),
    learnMore: aiResponse.learnMore.trim(),
  };
  return cleanedResponse;
};


const getQuestionAssist = async (
  question: Question,
): Promise<AIQuestionResponse> => {

  const preparedQuestion = prepareQuestion(question, true);
  const result = await generateChatCompletion(questionPrompt.text, preparedQuestion);

  try {
    const parsedResult = JSON.parse(result);
    console.log(parsedResult);
    const cleanedResult = cleanResponse(
      parsedResult as AIQuestionResponse,
    );
    return cleanedResult as AIQuestionResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    return defaultResponse;
  }
};

export default getQuestionAssist;

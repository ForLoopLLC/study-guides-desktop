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

const cleanQuestionResponse = (
  aiResponse: AIQuestionResponse,
): AIQuestionResponse => {
  const cleanedResponse: AIQuestionResponse = {
    distractors: aiResponse.distractors.map((d: string) => {
      const trimmed = d.trim();
      return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
    }),
    learnMore: aiResponse.learnMore.trim(),
    metaTags: aiResponse.metaTags.map((d: string) => {
      const trimmed = d.trim();
      return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
    }),
  };
  return cleanedResponse;
};

export const getQuestionAssist = async (
  question: Question,
): Promise<AIQuestionResponse> => {
  const prompt = questionPrompt;
  const preparedQuestion = prepareQuestion(question, true);

  const result = await generateChatCompletion(prompt.text, preparedQuestion);
  try {
    const parsedResult = JSON.parse(result);
    const cleanedResult = cleanQuestionResponse(
      parsedResult as AIQuestionResponse,
    );
    return cleanedResult as AIQuestionResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    return defaultResponse;
  }
};

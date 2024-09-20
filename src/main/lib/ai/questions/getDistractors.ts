import { Question } from '@prisma/client';
import { log } from '../../../main';
import { generateChatCompletion } from '../generateChatCompletion';
import { distractorPrompt } from './prompts';
import { prepareQuestion } from './prepareQuestion';

const getDistractors = async (question: Question): Promise<string[]> => {
  const preparedQuestion = prepareQuestion(question);
  const result = await generateChatCompletion(
    distractorPrompt.text,
    preparedQuestion,
  );
  try {
    const parsedResult = JSON.parse(result);

    let distractors: string[];
    if (Array.isArray(parsedResult)) {
      distractors = parsedResult;
    } else if (
      typeof parsedResult === 'object' &&
      Array.isArray(parsedResult.distractors)
    ) {
      distractors = parsedResult.distractors;
    } else {
      distractors = [];
    }

    return distractors;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    return [];
  }
};

export default getDistractors;

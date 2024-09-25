import { Question } from '@prisma/client';
import { metaTagsPrompt } from './prompts';
import { log } from '../../../main';
import { generateChatCompletion } from '../generateChatCompletion';
import { prepareQuestion } from './prepareQuestion';

const getMetaTags = async (question: Question): Promise<string> => {
  const preparedQuestion = prepareQuestion(question, true);
  const result = await generateChatCompletion(
    metaTagsPrompt.text,
    preparedQuestion,
  );

  try {
    const parsedResult = JSON.parse(result);
    log.info('ai', `Parsed AI response successfully for question ${question.id}.`);
    return parsedResult;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    log.error('ai', `Bad result. ${JSON.stringify(result)}.`);
    return '';
  }
};

export default getMetaTags;

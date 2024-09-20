import { ContentRatingType } from '@prisma/client';
import { contentRatingPrompt } from './prompts';
import { AiContentRatingResponse, TagWithQuestions } from '../../../../types';
import { log } from '../../../main';
import { generateChatCompletion } from '../generateChatCompletion';
import { prepareQuestions } from './prepareQuestions';

const getContentRating = async (
  tag: TagWithQuestions,
): Promise<AiContentRatingResponse> => {
  const defaultResonse = {
    contentRating: ContentRatingType.RatingPending,
    contentDescriptors: [],
  };

  const preparedQuestions = prepareQuestions(tag);

  const result = await generateChatCompletion(
    contentRatingPrompt.text,
    preparedQuestions,
  );

  try {
    const parsedResult = JSON.parse(result);
    return parsedResult as AiContentRatingResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    return defaultResonse;
  }
};

export default getContentRating;

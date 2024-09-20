import { AITopicResponse, TagWithQuestions } from '../../../../types';
import { log } from '../../../main';
import { topicPrompt } from './prompts';
import { prepareQuestions } from './prepareQuestions';
import { generateChatCompletion } from '../generateChatCompletion';
import { ContentRatingType } from '@prisma/client';

export const defaultResponse = {
  contentRating: ContentRatingType.RatingPending,
  contentDescriptors: [],
  metaTags: [],
};

const getTagWithQuestionsAssist = async (
  tag: TagWithQuestions,
): Promise<AITopicResponse> => {
  const preparedQuestions = prepareQuestions(tag);
  const result = await generateChatCompletion(
    topicPrompt.text,
    preparedQuestions,
  );

  try {
    const parsedResult = JSON.parse(result);
    log.info('ai', `Parsed AI response successfully for tag ${tag.name}.`);
    return parsedResult as AITopicResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string ${result}. ${err.message}.`);
    return defaultResponse;
  }
};

export default getTagWithQuestionsAssist;

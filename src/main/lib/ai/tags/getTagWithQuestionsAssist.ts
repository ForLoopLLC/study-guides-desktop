import { AITopicResponse, TagWithQuestions } from '../../../../types';
import { log } from '../../../main';
import { topicPrompt } from './prompts';
import { prepareQuestions } from './prepareQuestions';
import { generateChatCompletion } from '../generateChatCompletion';
import { ContentRatingType } from '@prisma/client';
import { parseAITopicWithQuestionResponse } from './parsers';

export const defaultResponse = {
  contentRating: ContentRatingType.RatingPending,
  contentDescriptors: [],
  metaTags: [],
};

const getTagWithQuestionsAssist = async (
  tag: TagWithQuestions,
): Promise<AITopicResponse> => {
  const preparedQuestions = prepareQuestions(tag);
  console.log(preparedQuestions);
  const result = await generateChatCompletion(
    topicPrompt.text,
    `Topic name: ${tag.name}. ${preparedQuestions}`,
  );

  try {
    const parsedResult = parseAITopicWithQuestionResponse(result);
    console.log(parsedResult);
    log.info('ai', `Parsed AI response successfully for tag ${tag.name}.`);
    return parsedResult as AITopicResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string ${result}. ${err.message}.`);
    log.error('ai', `Bad result. ${JSON.stringify(result)}.`);
    return defaultResponse;
  }
};

export default getTagWithQuestionsAssist;

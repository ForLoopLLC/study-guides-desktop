import { AITopicResponse, ParsedCollegeTopic, ParsedCertificationTopic } from '../../../../types';
import { log } from '../../../main';
import { topicPrompt } from '../tags/prompts';
import prepareQuestions from './prepareQuestions';
import { generateChatCompletion } from '../generateChatCompletion';
import { ContentRatingType } from '@prisma/client';

export const defaultResponse = {
  contentRating: ContentRatingType.RatingPending,
  contentDescriptors: [],
  metaTags: [],
};

const getParsedTopicAssist = async (
  topic: ParsedCertificationTopic | ParsedCollegeTopic,
): Promise<AITopicResponse> => {
  const preparedQuestions = prepareQuestions(topic);
  const result = await generateChatCompletion(
    topicPrompt.text,
    preparedQuestions,
  );

  try {
    const parsedResult = JSON.parse(result);
    log.info('ai', `Parsed AI response successfully for tag ${topic.name}.`);
    return parsedResult as AITopicResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string ${result}. ${err.message}.`);
    log.error('ai', `Bad result. ${JSON.stringify(result)}.`);
    return defaultResponse;
  }
};

export default getParsedTopicAssist;

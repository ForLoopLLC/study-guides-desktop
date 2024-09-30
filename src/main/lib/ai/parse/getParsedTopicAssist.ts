import { AITopicResponse, ParsedCollegeTopic, ParsedCertificationTopic } from '../../../../types';
import { log } from '../../../main';
import { topicPrompt } from '../tags/prompts';
import prepareQuestions from './prepareQuestions';
import { generateChatCompletion } from '../generateChatCompletion';
import { ContentRatingType } from '@prisma/client';
import { mergeTopicWithAssist } from '.';

const getParsedTopicAssist = async (
  topic: ParsedCertificationTopic | ParsedCollegeTopic,
): Promise<ParsedCertificationTopic | ParsedCollegeTopic> => {
  const preparedQuestions = prepareQuestions(topic);
  const result = await generateChatCompletion(
    topicPrompt.text,
    preparedQuestions,
  );

  try {
    const parsedResult = JSON.parse(result);
    log.info('ai', `Parsed AI response successfully for topic ${topic.name}.`);
    return mergeTopicWithAssist(topic, parsedResult as AITopicResponse);
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string ${result}. ${err.message}.`);
    log.error('ai', `Bad result. ${JSON.stringify(result)}.`);
    throw new Error('Failed to parse AI response.');
  }
};

export default getParsedTopicAssist;

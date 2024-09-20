import { AITopicResponse, TagWithQuestions } from '../../../../types';
import { log } from '../../../main';
import { topicPrompt } from './prompts';
import { prepareQuestions } from './prepareQuestions';
import { generateChatCompletion } from '../generateChatCompletion';
import { ContentRatingType } from '@prisma/client';

export const defaultResponse = {
  content: {
    rating: ContentRatingType.RatingPending,
    descriptors: [],
  },
  metaTags: [],
};

export const getTagWithQuestionsAssist = async (
  tag: TagWithQuestions,
): Promise<AITopicResponse> => {
  const prompt = topicPrompt; ////(await getPrompt(PromptType.ContentRating)) as Prompt;
  const userPrompt = prepareQuestions(tag);

  const result = await generateChatCompletion(prompt.text, userPrompt);
  try {
    const parsedResult = JSON.parse(result);
    return parsedResult as AITopicResponse;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not a valid JSON string. ${err.message}.`);
    return defaultResponse;
  }
};

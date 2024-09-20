import { ContentRatingType } from '@prisma/client';

export interface AiContentRatingResponse {
  contentRating: ContentRatingType;
  contentDescriptors: string[];
}

export interface AIMetaTagsResponse {
  metaTags: string[];
}

export interface AILearnMoreResponse {
  learnMore: string;
}

export interface AIDistractorsResponse {
  distractors: string[];
}

export interface AITopicResponse extends AiContentRatingResponse, AIMetaTagsResponse {}
export interface AIQuestionResponse extends AILearnMoreResponse, AIDistractorsResponse, AIMetaTagsResponse {}




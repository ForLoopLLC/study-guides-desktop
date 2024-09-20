import { ContentRatingType } from '@prisma/client';

export interface AiContentRatingResponse {
  type: ContentRatingType;
  descriptors: string[];
}

export interface AITopicResponse {
  content: {
    rating: ContentRatingType;
    descriptors: string[];
  };
  metaTags: string[];
}

export interface AIQuestionResponse {
  learnMore: string;
  distractors: string[];
  metaTags: string[];
}

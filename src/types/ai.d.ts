import { ContentRatingType } from '@prisma/client';

export interface AiContentRating {
    type: ContentRatingType;
    descriptors: string[];
  }
  
  export interface AITopicResponse {
    content: {
      rating: ContentRatingType;
      descriptors: string[];
    };
    tags: string[];
  }
  
  export interface AIQuestionResponse {
    learnMore: string;
    distractors: string[];
  }
import type {
  AlgoliaRecord as PismaAlgoliaRecord,
  ContentRatingType,
} from '@prisma/client';

export interface AlgoliaRecord extends PismaAlgoliaRecord {}

export type TagInfo = {
  id: string;
  name: string;
  type: string;
};

export type AlgoliaTagRecord = {
  objectID: string;
  id: string;
  name: string;
  type: string;
  tags: TagInfo[];
  metaTags: string[];
  metadata: any;
  batchId: string | null;
  contentRating: ContentRatingType;
  contentDescriptors: string[];
  missingContentDescriptors: boolean;
  missingContentRating: boolean;
  missingMetaTags: boolean;
};

export type AlgoliaQuestionRecord = {
  objectID: string;
  id: string;
  questionText: string;
  answerText: string;
  learnMore: string;
  distractors: string[];
  metadata: any;
  batchId: string | null;
  missingDistractors: boolean;
  missingLearnMore: boolean;
};

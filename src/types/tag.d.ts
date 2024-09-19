import type {
  Tag as PrismaTag,
  Question as PrismaQuestion,
  TagType,
  ContentRatingType,
} from '@prisma/client';

export interface Tag extends PrismaTag {

}
export interface Question extends PrismaQuestion {}

export interface UpdateTagInput {
  id: string;
  name?: string;
  description?: string;
  type?: TagType;
  contentRating?: ContentRatingType;
  contentDescriptors?: string[];
  metaTags?: string[];
  parentTagId?: string;
  public?: boolean;
  metadata?: any; // Assuming metadata is a JSON object
}

export interface TagWithRelations extends Tag {
  parentTag: Tag | null;
  childTags: Tag[];
}

export interface TagWithQuestions extends Tag {
  questions: {
    question: Question;
  }[];
}


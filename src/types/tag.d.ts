import type {
  Tag as PrismaTag,
  TagType,
  ContentRatingType,
} from '@prisma/client';

export interface Tag extends PrismaTag {}

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


import {
  Tag,
  AlgoliaRecord,
  AlgoliaRecordType,
  ContentRatingType,
} from "@prisma/client";
import { AlgoliaTagRecord, TagInfo } from '../../../../types';
import { environmentManager } from "../../environment";

const createTagIndex = async (
  tag: Tag,
  parentTags: TagInfo[] = [],
): Promise<AlgoliaRecord | null> => {
  try {
    const prisma = environmentManager.getPrismaClient();
    const algoliaTagRecord: AlgoliaTagRecord = {
      objectID: tag.id,
      id: tag.id,
      name: tag.name,
      type: tag.type,
      tags: parentTags,
      metadata: tag.metadata,
      batchId: tag.batchId,
      metaTags: tag.metaTags,
      contentRating: tag.contentRating,
      contentDescriptors: tag.contentDescriptors,
      missingContentDescriptors: tag.contentDescriptors.length === 0,
      missingContentRating:
        tag.contentRating === ContentRatingType.RatingPending,
      missingMetaTags: tag.metaTags.length === 0,
    };

    const record = await prisma.algoliaRecord.upsert({
      where: {
        id: tag.id,
      },
      update: {
        id: tag.id,
        record: algoliaTagRecord,
        updatedAt: new Date(),
        uploaded: false,
      },
      create: {
        id: tag.id,
        type: AlgoliaRecordType.Topic,
        record: algoliaTagRecord,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploaded: false,
      },
    });

    return record;
  } catch (error) {
    console.error(`Error adding/updating topic search record. ${error}`);
    return null;
  }
};

export default createTagIndex;

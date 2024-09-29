import {
  Tag,
  AlgoliaRecord,
  AlgoliaRecordType,
  ContentRatingType,
  TagType,
} from '@prisma/client';
import { AlgoliaTagRecord, TagInfo } from '../../../../types';
import { environmentManager } from '../../environment';
import {log} from '../../../main';

const mapTagTypeToAlgoliaRecordType = (tagType: TagType): AlgoliaRecordType => {
  const lookup: Record<TagType, AlgoliaRecordType> = {
    [TagType.Topic]: AlgoliaRecordType.Topic,
    [TagType.Category]: AlgoliaRecordType.Category,
    [TagType.SubCategory]: AlgoliaRecordType.SubCategory,
    [TagType.University]: AlgoliaRecordType.University,
    [TagType.Region]: AlgoliaRecordType.Region,
    [TagType.Department]: AlgoliaRecordType.Department,
    [TagType.Course]: AlgoliaRecordType.Course,
    [TagType.UserFolder]: AlgoliaRecordType.SubCategory,
    [TagType.Organization]: AlgoliaRecordType.Organization,
    [TagType.Certification]: AlgoliaRecordType.Certification,
    [TagType.Module]: AlgoliaRecordType.Module,
  };

  // Return the corresponding AlgoliaRecordType
  return lookup[tagType];
};

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

    const algoliaRecordType = mapTagTypeToAlgoliaRecordType(tag.type);

    const record = await prisma.algoliaRecord.upsert({
      where: {
        id: tag.id,
      },
      update: {
        id: tag.id,
        record: algoliaTagRecord,
        type: algoliaRecordType,
        updatedAt: new Date(),
        uploaded: false,
      },
      create: {
        id: tag.id,
        type: algoliaRecordType,
        record: algoliaTagRecord,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploaded: false,
      },
    });

    return record;
  } catch (error) {
    const err = error as Error;
    log.error('index',`Error adding/updating topic search record. ${err.message}.`);
    return null;
  }
};

export default createTagIndex;

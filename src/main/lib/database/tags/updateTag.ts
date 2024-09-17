import { Tag, UpdateTagInput } from '../../../../types';
import { environmentManager } from '../../environment';
import { getHash } from '../../../util';
import {log} from '../../../main';

const updateTag = async (input: UpdateTagInput): Promise<Tag | null> => {
  const prisma = environmentManager.getPrismaClient();

  try {
    // Fetch the existing tag to get the current metadata
    const existingTag = await prisma.tag.findUnique({
      where: { id: input.id },
    });

    if (!existingTag) {
      throw new Error('Tag not found');
    }

    let parentTag = null;
    if (existingTag.parentTagId) {
      parentTag = await prisma.tag.findUnique({
        where: { id: existingTag.parentTagId },
      });
    }

    // Ensure existing metadata is an object before merging
    const existingMetadata =
      typeof existingTag.metadata === 'object' && existingTag.metadata !== null
        ? (existingTag.metadata as Record<string, any>)
        : {};

    // Ensure input metadata is an object
    const inputMetadata =
      typeof input.metadata === 'object' && input.metadata !== null
        ? input.metadata
        : {};

    // Merge the existing metadata with the new metadata
    const mergedMetadata = { ...existingMetadata, ...inputMetadata };

    let hash;
    if (parentTag && existingTag.name !== input.name) {
      // Generate a new hash if the name has changed and the tag has a parent
      hash = getHash(parentTag.name + input.name);
    } else {
      hash = existingTag.hash;
    }

    // Perform the update with merged metadata
    const updatedTag = await prisma.tag.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        hash: hash,
        type: input.type,
        contentRating: input.contentRating,
        contentDescriptors: input.contentDescriptors,
        metaTags: input.metaTags,
        parentTagId: input.parentTagId,
        public: input.public,
        metadata: mergedMetadata, // Update with merged metadata
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
    });

    return updatedTag;
  } catch (error) {
    const err = error as Error;
    log.error('tag', `Error updating tag. ${err.message}.`);
    return null;
  }
};

export default updateTag;

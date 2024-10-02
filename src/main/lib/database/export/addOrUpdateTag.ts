import { EtlTag } from '../../../../types';
import { environmentManager } from '../../environment';

const addOrUpdateTag = async (tag: EtlTag): Promise<boolean> => {
  const prisma = environmentManager.getPrismaClient();
  try {
    // Check if the tag with the given hash already exists
    const existingTag = await prisma.tag.findUnique({
      where: {
        hash: tag.hash,
      },
    });

    // If the tag exists, we don't need to do anything, so return true
    if (existingTag) {
      console.log(`Tag ${tag.name} (${tag.hash}) already exists.`);
      return true;
    }

    // If there's a parentHash, find the parent tag
    let parentTag = null;
    if (tag.parentHash) {
      parentTag = await prisma.tag.findUnique({
        where: {
          hash: tag.parentHash,
        },
      });
      parentTag && console.log(`Found parent tag ${parentTag?.name} (${parentTag?.hash})`);
    } else {
        console.log(`No parent tag for  ${tag.name} (${tag.hash}).`);
    }

    // Create the tag since it doesn't exist
    await prisma.tag.create({
      data: {
        name: tag.name,
        description: tag.description,
        type: tag.type,
        hash: tag.hash,
        parentTagId: parentTag ? parentTag.id : undefined,
        contentDescriptors: tag.contentDescriptors,
        contentRating: tag.contentRating,
        metaTags: tag.metaTags,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    const err = error as Error;
    console.error(`Error adding/updating tag: ${err.message}`);
    return false;
  }
};

export default addOrUpdateTag;

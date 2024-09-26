import { TagInfo } from '../../../../types';
import { environmentManager } from '../../environment';

export const getTagAncestry = async (tagId: string): Promise<TagInfo[]> => {
  const prisma = environmentManager.getPrismaClient();

  if (!tagId) {
    return [];
  }

  const tagInfos: TagInfo[] = [];

  const climbAncestryTree = async (currentTagId: string) => {
    const tag = await prisma.tag.findUnique({
      where: { id: currentTagId },
      select: {
        id: true,
        name: true,
        type: true,
        parentTagId: true,
      },
    });

    if (!tag) {
      return;
    }

    // Add the current tag to the ancestry list
    tagInfos.push({
      id: tag.id,
      name: tag.name,
      type: tag.type,
    });

    // If there's a parentTagId, recursively climb the tree
    if (tag.parentTagId) {
      await climbAncestryTree(tag.parentTagId);
    }
  };

  // Start climbing the tree from the provided tagId
  await climbAncestryTree(tagId);

  return tagInfos;
};

export default getTagAncestry;

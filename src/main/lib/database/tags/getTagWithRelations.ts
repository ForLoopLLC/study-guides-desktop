import { Tag } from '@prisma/client';
import { environmentManager } from '../../environment';
import { TagWithRelations } from '../../../../types';


export const getTagWithRelations = async (id: string): Promise<TagWithRelations | null> => {
  const prisma = environmentManager.getPrismaClient();

  const tag = await prisma.tag.findUnique({
    where: {
      id,
    },
    include: {
      parentTag: true,  // Fetches the parent tag
      childTags: true,  // Fetches the child tags
    },
  });

  return tag;
};

export default getTagWithRelations;

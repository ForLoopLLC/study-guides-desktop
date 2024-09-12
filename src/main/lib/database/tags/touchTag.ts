import { environmentManager } from '../../environment';
import { Tag } from '../../../../types';



const touchTag = async (id: string): Promise<Tag> => {
  const prisma = environmentManager.getPrismaClient();

  try {

    // Perform the update with merged metadata
    const updatedTag = await prisma.tag.update({
      where: { id: id },
      data: {
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
    });

    return updatedTag;
  } catch (error) {
    throw new Error('Failed to touch tag.');
  }
};

export default touchTag;

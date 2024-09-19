import { environmentManager } from '../../environment';
import { log } from '../../../main';

const deleteTagIndex = async (tagId: string): Promise<boolean> => {
  try {
    const prisma = environmentManager.getPrismaClient();

    // Delete the corresponding record from the AlgoliaRecord table
    await prisma.algoliaRecord.delete({
      where: {
        id: tagId,
      },
    });

    return true;
  } catch (error) {
    const err = error as Error;
    log.error(
      'index',
      `Error deleting Algolia record with tag ID ${tagId}: ${err.message}.`,
    );
    return false;
  }
};

export default deleteTagIndex;

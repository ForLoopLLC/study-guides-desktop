import { environmentManager } from '../../environment';
import { log } from '../../../main';

const deleteQuestionIndex = async (questionId: string): Promise<boolean> => {
  try {
    const prisma = environmentManager.getPrismaClient();

    // Delete the corresponding record from the AlgoliaRecord table
    await prisma.algoliaRecord.delete({
      where: {
        id: questionId,
      },
    });

    return true;
  } catch (error) {
    const err = error as Error;
    log.error(
      'index',
      `Error deleting Algolia record with question ID ${questionId}: ${err.message}.`,
    );
    return false;
  }
};

export default deleteQuestionIndex;

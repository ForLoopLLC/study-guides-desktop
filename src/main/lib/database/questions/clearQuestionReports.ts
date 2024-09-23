import { environmentManager } from '../../environment';

const clearQuestionReports = async (id: string): Promise<boolean> => {
  const prisma = environmentManager.getPrismaClient();

  try {
    await prisma.userTagReport.deleteMany({
      where: { tagId: id },
    });

    return true;
  } catch (error) {
    const err = error as Error;
    throw new Error(`${err.message}`);
  }
};

export default clearQuestionReports;

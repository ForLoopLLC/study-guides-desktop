import { environmentManager } from '../../environment';
import { Question } from '../../../../types';



const touchQuestion = async (id: string): Promise<Question> => {
  const prisma = environmentManager.getPrismaClient();

  try {

    // Perform the update with merged metadata
    const updatedQuestion = await prisma.question.update({
      where: { id: id },
      data: {
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
    });

    return updatedQuestion;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to touch question. ${err.message}`);
  }
};

export default touchQuestion;

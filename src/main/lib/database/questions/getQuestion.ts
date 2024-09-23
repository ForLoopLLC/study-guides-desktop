import { Question } from '../../../../types';
import { environmentManager } from '../../environment';

export const getQuestion = async (
  questionId: string,
): Promise<Question | null> => {

  const prisma = environmentManager.getPrismaClient();

  if (!questionId) {
    return null;
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    return null;
  }

  return question
};


export default getQuestion;
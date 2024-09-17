import { environmentManager } from '../../environment';
import { TagWithQuestions } from '../../../../types';

export const getTagWithQuestions = async (
  id: string,
): Promise<TagWithQuestions | null> => {
  const prisma = environmentManager.getPrismaClient();

  const tag = await prisma.tag.findUnique({
    where: {
      id,
    },
    include: {
        questions: {
          include: {
            question: true,  // Include the related Question
          },
        },
      },
  });

  return tag;
};

export default getTagWithQuestions;

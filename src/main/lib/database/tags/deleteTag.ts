import { environmentManager } from '../../environment';
import { log } from '../../../main';

const deleteTag = async (id: string): Promise<boolean> => {
  const prisma = environmentManager.getPrismaClient();

  try {
    // Fetch the tag to ensure it exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: {
        childTags: true,  // Include childTags relation to check if it has children
        questions: true,  // Include questions relation to check if it has associated questions
      },
    });

    if (!existingTag) {
      throw new Error('Tag not found');
    }

    // Check if the tag has child tags or associated questions
    if (existingTag.childTags.length > 0) {
      throw new Error('Tag has child tags and cannot be deleted.');
    }

    if (existingTag.questions.length > 0) {
      throw new Error('Tag has associated questions and cannot be deleted.');
    }

    // If there are no child tags or questions, proceed with the deletion
    await prisma.tag.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    const err = error as Error;
    throw new Error(`${err.message}`);
  }
};

export default deleteTag;

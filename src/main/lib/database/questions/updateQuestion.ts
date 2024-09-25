import { Question, UpdateQuestionInput } from '../../../../types';
import { environmentManager } from '../../environment';
import { getHash } from '../../../util';
import {log} from '../../../main';

const updateQuestion = async (input: UpdateQuestionInput): Promise<Question | null> => {
  const prisma = environmentManager.getPrismaClient();
  let newHash: string = '';

  try {
    // Fetch the existing tag to get the current metadata
    const existingQuestion = await prisma.question.findUnique({
      where: { id: input.id },
    });

    if (!existingQuestion) {
      throw new Error('Question not found');
    }



    // Ensure existing metadata is an object before merging
    const existingMetadata =
      typeof existingQuestion.metadata === 'object' && existingQuestion.metadata !== null
        ? (existingQuestion.metadata as Record<string, any>)
        : {};

    // Ensure input metadata is an object
    const inputMetadata =
      typeof input.metadata === 'object' && input.metadata !== null
        ? input.metadata
        : {};

    // Merge the existing metadata with the new metadata
    const mergedMetadata = { ...existingMetadata, ...inputMetadata };

    if (existingQuestion.answerText !== input.answerText || existingQuestion.questionText !== input.questionText) {
      newHash = getHash(input.questionText + input.answerText);
    } 


    // Perform the update with merged metadata
    const updatedQuestion = await prisma.question.update({
      where: { id: input.id },
      data: {
        questionText: input.questionText,
        answerText: input.answerText,
        learnMore: input.learnMore,
        distractors: input.distractors,
        videoUrl: input.videoUrl,
        imageUrl: input.imageUrl,
        hash: newHash || existingQuestion.hash,
        metadata: mergedMetadata, // Update with merged metadata
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
    });

    return updatedQuestion;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to update question: ${err.message}`);
  }
};

export default updateQuestion;

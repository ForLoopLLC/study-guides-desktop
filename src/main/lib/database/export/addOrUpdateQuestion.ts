import { EtlQuestion } from '../../../../types';
import { environmentManager } from '../../environment';

const addOrUpdateQuestion = async (question: EtlQuestion): Promise<boolean> => {
  const prisma = environmentManager.getPrismaClient();
  try {
    // Upsert the question (insert or update)
    const upsertedQuestion = await prisma.question.upsert({
      where: {
        hash: question.hash,
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        questionText: question.question,
        answerText: question.answer,
        hash: question.hash,
        distractors: question.distractors,
        learnMore: question.learnMore,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Check if the parent hash is provided
    if (!question.parentHash) {
      console.error('Parent hash is not provided.');
      return false;
    }

    // Find the parent tag by its hash
    const parentTag = await prisma.tag.findUnique({
      where: {
        hash: question.parentHash,
      },
    });

    // Return false if the parent tag does not exist
    if (!parentTag) {
      console.error(`Parent tag with hash ${question.parentHash} not found.`);
      return false;
    }

    // Check if the QuestionTag already exists
    const existingQuestionTag = await prisma.questionTag.findUnique({
      where: {
        questionId_tagId: {
          questionId: upsertedQuestion.id,
          tagId: parentTag.id,
        },
      },
    });

    // Create the QuestionTag if it doesn't exist
    if (!existingQuestionTag) {
      await prisma.questionTag.create({
        data: {
          questionId: upsertedQuestion.id,
          tagId: parentTag.id,
          createdAt: new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    const err = error as Error;
    console.error(`Error adding/updating question: ${err.message}`);
    return false;
  }
};

export default addOrUpdateQuestion;

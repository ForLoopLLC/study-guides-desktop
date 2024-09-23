import { Question, AlgoliaRecord, AlgoliaRecordType } from '@prisma/client';
import { AlgoliaQuestionRecord } from '../../../../types';
import { environmentManager } from '../../environment';
import { log } from '../../../main';

const createQuestionIndex = async (
  question: Question,
): Promise<AlgoliaRecord | null> => {
  try {
    const prisma = environmentManager.getPrismaClient();
    const algoliaQuestionRecord: AlgoliaQuestionRecord = {
      id: question.id,
      objectID: question.id,
      questionText: question.questionText,
      answerText: question.answerText,
      learnMore: question.learnMore,
      distractors: question.distractors,
      tags: [],
      metadata: question.metadata,
      batchId: null,
      missingDistractors: false,
      missingLearnMore: false,
    };

    const record = await prisma.algoliaRecord.upsert({
      where: {
        id: question.id,
      },
      update: {
        id: question.id,
        record: algoliaQuestionRecord,
        type: AlgoliaRecordType.Question,
        updatedAt: new Date(),
        uploaded: false,
      },
      create: {
        id: question.id,
        type: AlgoliaRecordType.Question,
        record: algoliaQuestionRecord,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploaded: false,
      },
    });

    return record;
  } catch (error) {
    const err = error as Error;
    log.error(
      'index',
      `Error adding/updating question search record. ${err.message}.`,
    );
    return null;
  }
};

export default createQuestionIndex;

import {
  Question,
  AIQuestionResponse,
  AILearnMoreResponse,
  AIDistractorsResponse,
  UpdateQuestionInput,
} from '../../../../types';

const mergeQuestionWithAssist = async (
  question: Question,
  assist: AIQuestionResponse | AILearnMoreResponse | AIDistractorsResponse,
): Promise<UpdateQuestionInput> => {
  return {
    ...question, // Spread original question properties
    questionText: question.questionText ?? undefined, // fix values to match interface
    batchId: question.batchId ?? undefined, // fix values to match interface
    answerText: question.answerText ?? undefined, // fix values to match interface
    metadata: question.metadata ?? undefined, // fix values to match interface
    videoUrl: question.videoUrl ?? undefined, // fix values to match interface
    imageUrl: question.imageUrl ?? undefined, // fix values to match interface
    learnMore: question.learnMore ?? undefined, // fix values to match interface
    distractors: question.distractors ?? undefined, // fix values to match interface
    ...assist, // Overwrite or add AI-generated fields from assist
  };
};

export default mergeQuestionWithAssist;

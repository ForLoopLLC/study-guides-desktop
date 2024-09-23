import { log } from '../../../main';
import { AIDistractorsResponse, UpdateQuestionInput } from '../../../../types';
import { getQuestion } from '../../database/questions';
import { getDistractors, mergeQuestionWithAssist } from '../index';

const getDistractorsInput = async (
  questionId: string,
): Promise<UpdateQuestionInput> => {
  const question = await getQuestion(questionId);
  if (!question) {
    throw new Error('Failed to fetch question.');
  }

  const assist: AIDistractorsResponse = await getDistractors(question);
  if (!assist) {
    throw new Error('Failed to fetch assist.');
  }
  return mergeQuestionWithAssist(question, assist);
};

export default getDistractorsInput;

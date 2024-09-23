import { log } from '../../../main';
import { AIQuestionResponse, UpdateQuestionInput } from '../../../../types';
import { getQuestion } from '../../database/questions';
import { getQuestionAssist, mergeQuestionWithAssist } from '../index';

const getQuestionInput = async (
  questionId: any,
): Promise<UpdateQuestionInput> => {
  const question = await getQuestion(questionId);
  if (!question) {
    throw new Error('Failed to fetch question.');
  }

  const assist: AIQuestionResponse = await getQuestionAssist(question);
  if (!assist) {
    throw new Error('Failed to fetch assist.');
  }

  const mergedQuestion = await mergeQuestionWithAssist(question, assist);
  return mergedQuestion;
};

export default getQuestionInput;

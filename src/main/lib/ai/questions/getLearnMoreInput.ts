import { log } from '../../../main';
import { AILearnMoreResponse, UpdateQuestionInput } from '../../../../types';
import { getQuestion } from '../../database/questions';
import { getLearnMore, mergeQuestionWithAssist } from '../index';

const getContentRatingInput = async (
  questionId: string,
): Promise<UpdateQuestionInput> => {
  const question = await getQuestion(questionId);
  if (!question) {
    throw new Error('Failed to fetch question.');
  }

  const assist: AILearnMoreResponse = await getLearnMore(question);
  if (!assist) {
    throw new Error('Failed to fetch assist.');
  }
  return mergeQuestionWithAssist(question, assist);
};

export default getContentRatingInput;

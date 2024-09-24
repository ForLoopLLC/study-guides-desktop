import { log } from '../../../main';
import { UpdateQuestionInput } from '../../../../types';
import { getQuestion } from '../../database/questions';
import { getDistractors, mergeQuestionWithAssist } from '../index';
import { parseAIDistractorsResponse } from './parsers';

const getDistractorsInput = async (
  questionId: string,
): Promise<UpdateQuestionInput> => {
  try {
    const question = await getQuestion(questionId);
    if (!question) {
      throw new Error('Failed to fetch question.');
    }

    const raw = await getDistractors(question);
    const parsed = parseAIDistractorsResponse(raw);

    if (!parsed) {
      throw new Error('Failed to fetch assist.');
    }
    return mergeQuestionWithAssist(question, parsed);
  } catch (error) {
    const err = error as Error;
    log.error('ai', `Failed to fetch assist. ${err.message}`);
    throw new Error('Failed to fetch assist.');
  }
};

export default getDistractorsInput;

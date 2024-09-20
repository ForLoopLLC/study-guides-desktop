import { log } from '../../../main';
import { AITopicResponse, UpdateTagInput } from '../../../../types';
import { getTagWithQuestions } from '../../database/tags';
import { getTagWithQuestionsAssist, mergeTagWithAssist } from '../index';

const getTagInput = async (tagId: any): Promise<UpdateTagInput> => {
  const tag = await getTagWithQuestions(tagId);
  if (!tag) {
    throw new Error('Failed to fetch tag.');
  }

  const assist: AITopicResponse = await getTagWithQuestionsAssist(tag);
  if (!assist) {
    throw new Error('Failed to fetch assist.');
  }

  const mergedTag = await mergeTagWithAssist(tag, assist);
  return mergedTag;
};

export default getTagInput;

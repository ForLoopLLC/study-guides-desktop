import { log } from '../../../main';
import { AiContentRatingResponse, UpdateTagInput } from '../../../../types';
import { getTagWithQuestions } from '../../database/tags';
import { getContentRating, mergeTagWithAssist } from '../index';

const getContentRatingInput = async (
  tagId: string,
): Promise<UpdateTagInput> => {
  const tag = await getTagWithQuestions(tagId);
  if (!tag) {
    throw new Error('Failed to fetch tag.');
  }

  const assist: AiContentRatingResponse = await getContentRating(tag);
  if (!assist) {
    throw new Error('Failed to fetch assist.');
  }
  return mergeTagWithAssist(tag, assist);
};

export default getContentRatingInput;

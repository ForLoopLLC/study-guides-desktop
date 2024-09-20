import {
  Tag,
  AITopicResponse,
  AiContentRatingResponse,
  UpdateTagInput,
} from '../../../../types';

const mergeTagWithAssist = async (
  tag: Tag,
  assist: AITopicResponse | AiContentRatingResponse,
): Promise<UpdateTagInput> => {
  return {
    ...tag, // Spread original tag properties
    description: tag.description ?? undefined, // fix values to match interface
    parentTagId: tag.parentTagId ?? undefined, // fix values to match interface
    ...assist, // Overwrite or add AI-generated fields from assist
  };
};

export default mergeTagWithAssist;

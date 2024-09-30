import { AITopicResponse, AiContentRatingResponse } from '../../../../types';

import {
  ParsedCertificationTopic,
  ParsedCollegeTopic,
} from '../../../../types';

const mergeTagWithAssist = async (
  topic: ParsedCertificationTopic | ParsedCollegeTopic,
  assist: AITopicResponse | AiContentRatingResponse,
): Promise<ParsedCertificationTopic | ParsedCollegeTopic> => {
  return {
    ...topic, // Spread original tag properties
    ...assist, // Overwrite or add AI-generated fields from assist
  };
};

export default mergeTagWithAssist;

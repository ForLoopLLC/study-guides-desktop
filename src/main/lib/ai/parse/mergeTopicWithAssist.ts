import { AITopicResponse, AiContentRatingResponse } from '../../../../types';
import { formatAsJSON } from '../../../util';

import {
  ParsedCertificationTopic,
  ParsedCollegeTopic,
} from '../../../../types';

const mergeTagWithAssist = (
  topic: ParsedCertificationTopic | ParsedCollegeTopic,
  assist: AITopicResponse | AiContentRatingResponse,
): ParsedCertificationTopic | ParsedCollegeTopic => {
  const result = {
    ...topic, // Spread original tag properties
    ...assist, // Overwrite or add AI-generated fields from assist
    toJson() {
      return formatAsJSON(this);
    },
  };
  return result;
};

export default mergeTagWithAssist;

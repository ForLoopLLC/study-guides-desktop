import { AITopicResponse } from '../../../../types';
import { log } from '../../../main';

export const parseAIDistractorsResponse = (
  input: string,
): AITopicResponse => {
  const distractorsMatch = input.match(/Distractors:\s*([\s\S]*)/);
  return {
    distractors: distractorsMatch
      ? distractorsMatch[1]
          .trim()
          .split('\n')
          .map((d) => d.replace('-', '').trim())
      : [],
  };
};

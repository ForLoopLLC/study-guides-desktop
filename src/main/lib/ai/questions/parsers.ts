// src/main/lib/ai/questions/parsers.ts

import { AIDistractorsResponse } from '../../../../types';
import { AILearnMoreResponse } from '../../../../types';
import { AIQuestionResponse } from '../../../../types';

export const parseAIDistractorsResponse = (input: string): AIDistractorsResponse => {
    const distractorsMatch = input.match(/Distractors:\s*([\s\S]*)/);
    return {
      distractors: distractorsMatch
        ? distractorsMatch[1].trim().split('\n').map(d => d.replace('-', '').trim())
        : [],
    };
  };


export const parseAILearnMoreResponse = (input: string): AILearnMoreResponse => {
    const learnMoreMatch = input.match(/LearnMore:\s*([\s\S]*)/);
    return {
      learnMore: learnMoreMatch ? learnMoreMatch[1].trim() : '',
    };
  };


export const parseAIQuestionResponse = (input: string): AIQuestionResponse => {
    const learnMoreMatch = input.match(/LearnMore:\s*([\s\S]*)/);
    const distractorsMatch = input.match(/Distractors:\s*([\s\S]*)LearnMore:/);
  
    const distractors = distractorsMatch
      ? distractorsMatch[1].trim().split('\n').map(d => d.replace('-', '').trim())
      : [];
  
    const learnMore = learnMoreMatch
      ? learnMoreMatch[1].trim()
      : '';
  
    return { distractors, learnMore };
  };
  
  
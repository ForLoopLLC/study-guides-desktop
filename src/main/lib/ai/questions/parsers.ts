// src/main/lib/ai/questions/parsers.ts

import { AIDistractorsResponse } from '../../../../types';
import { AILearnMoreResponse } from '../../../../types';
import { AIQuestionResponse } from '../../../../types';
import { log } from '../../../main';

export const parseAIDistractorsResponse = (
  input: string,
): AIDistractorsResponse => {
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

export const parseAILearnMoreResponse = (
  input: string,
): AILearnMoreResponse => {
  const learnMoreMatch = input.match(/LearnMore:\s*([\s\S]*)/);
  return {
    learnMore: learnMoreMatch ? learnMoreMatch[1].trim() : '',
  };
};

export const parseAIQuestionResponse = (input: string): AIQuestionResponse => {
  // Matches the distractors block, capturing LaTeX symbols wrapped in <latex> tags
  const distractorsMatch = input.match(
    /Distractors:\s*([\s\S]*?)(?=LearnMore:)/,
  );

  // Matches the learnMore block
  const learnMoreMatch = input.match(/LearnMore:\s*([\s\S]*)/);

  // Process distractors, preserving LaTeX symbols inside <latex> tags
  const distractors = distractorsMatch
    ? distractorsMatch[1]
        .trim()
        .split('\n')
        .filter((d) => d.startsWith('-')) // Keep only lines that start with '-'
        .map((d) => d.replace(/-\s*/, '').trim()) // Remove the leading '-' and trim
    : [];

  // Extract the learnMore section
  const learnMore = learnMoreMatch ? learnMoreMatch[1].trim() : '';

  if (!learnMore) {
    log.error(
      'ai',
      `Failed to parse learnMore this is what I tried to parse: ${input}`,
    );
  }

  if (!distractors.length || distractors.length !== 3) {
    log.error(
      'ai',
      `Failed to parse distractors this is what I tried to parse: ${input}`,
    );
  }

  return { distractors, learnMore };
};

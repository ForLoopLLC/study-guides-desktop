import { Question } from '@prisma/client';
import { TagWithQuestions } from '../../../../types';
import { log } from '../../../main';

export const prepareQuestions = (
  tag: TagWithQuestions,
  all: boolean = false,
): string => {
  if (tag.questions.length === 0) {
    log.warn('ai', `No questions found for tag ${tag.name}. Prompting AI to skip content rating.`);
    return `I have no questions for this topic just fill out the metaTags based on this title "${tag.name} and skip the content rating."`;
  }

  const allQuestions = tag.questions;
  const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
  const selectedQuestions = all
    ? shuffledQuestions
    : shuffledQuestions.slice(0, 25);

  const lines = selectedQuestions.map(
    ({ question }: { question: Question }, index: number) =>
      `Q${index + 1}: ${question.questionText} A: ${question.answerText}`,
  );

  return `Questions and Answers:\n${lines.join('\n')}`;
};

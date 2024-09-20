import { Question } from '@prisma/client';
import { TagWithQuestions } from '../../../../types';
import { log } from '../../../main';

export const prepareQuestions = (
  tag: TagWithQuestions,
  all: boolean = false,
): string => {
  
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

import { ParsedTopic, ParsedQuestion } from '../../../../types';
import { log } from '../../../main';

const prepareQuestions = (
  topic: ParsedTopic,
  all: boolean = false,
): string => {
  if (topic.questions.length === 0) {
    log.warn(
      'ai',
      `No questions found for tag ${topic.name}. Prompting AI to skip content rating.`,
    );
    return `I have no questions for this topic just fill out the metaTags based on this title "${topic.name} and skip the content rating."`;
  }

  const allQuestions = topic.questions;
  const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
  const selectedQuestions = all
    ? shuffledQuestions
    : shuffledQuestions.slice(0, 25);

  const lines = selectedQuestions.map(
    (question: ParsedQuestion, index: number) =>
      `Q${index + 1}: ${question.question} A: ${question.answer}`,
  );

  return `Questions and Answers:\n${lines.join('\n')}`;
};

export default prepareQuestions;

import { ParsedQuestion } from '../../../../types';

const prepareQuestion = (
  question: ParsedQuestion,
  includeAdditionalInfo: boolean = false,
): string => {
  if (includeAdditionalInfo) {
    return `Question: ${question.question} Answer: ${question.answer} (additional info: ${question.learnMore})`;
  } else {
    return `Question: ${question.question} Answer: ${question.answer}`;
  }
};

export default prepareQuestion;


import {
    Question,
  } from '@prisma/client';
  
  export const prepareQuestion = (question: Question, includeAdditionalInfo: boolean = false): string => {
    if (includeAdditionalInfo) {
      return `Question: ${question.questionText} Answer: ${question.answerText} (additional info: ${question.learnMore})`;
    } else {
        return `Question: ${question.questionText} Answer: ${question.answerText}`;
    }
  }